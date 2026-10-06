import { loadPricingConfig } from "@/config/pricing/default-pricing";
import { getEnabledCarrierAdapters } from "@/lib/api/carriers/adapters";
import { calculateInternalQuotes } from "@/lib/pricing/engine";
import { summarisePackageWeights } from "@/lib/pricing/weight";
import { quoteRequestSchema } from "@/lib/validation/quote";
import type {
  NormalizedQuoteOffer,
  QuoteRequest,
  QuoteResult,
} from "@/types/pricing";

function createRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `quote_${Date.now()}`;
}

/**
 * Orchestrates quote generation across internal engine + carrier adapters.
 * UI should only call this service — never import rate tables directly.
 */
export async function getQuote(
  rawRequest: QuoteRequest,
): Promise<QuoteResult> {
  const parsed = quoteRequestSchema.safeParse(rawRequest);

  if (!parsed.success) {
    const config = await loadPricingConfig();
    return {
      requestId: createRequestId(),
      generatedAt: new Date().toISOString(),
      weight: summarisePackageWeights(
        rawRequest.packages ?? [],
        config.volumetricDivisor,
      ),
      offers: [],
      warnings: [],
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const request = parsed.data as QuoteRequest;
  const config = await loadPricingConfig();

  // Authoritative weight + validation from the internal engine
  const internal = calculateInternalQuotes(request, config);

  if (internal.errors.length > 0) {
    return internal;
  }

  const adapters = getEnabledCarrierAdapters();
  const settled = await Promise.allSettled(
    adapters.map((adapter) => adapter.getRates(request)),
  );

  const offers: NormalizedQuoteOffer[] = [];
  const warnings = [...internal.warnings];

  settled.forEach((result, index) => {
    const adapter = adapters[index];
    if (result.status === "fulfilled") {
      offers.push(...result.value);
      return;
    }

    warnings.push(
      `${adapter.name} rates are temporarily unavailable. Other carriers still shown.`,
    );
  });

  // Deduplicate by carrier + service code (prefer lowest price)
  const deduped = new Map<string, NormalizedQuoteOffer>();
  for (const offer of offers) {
    const key = `${offer.carrierId}:${offer.serviceCode}`;
    const existing = deduped.get(key);
    if (!existing || offer.price.amount < existing.price.amount) {
      deduped.set(key, offer);
    }
  }

  const sorted = [...deduped.values()].sort(
    (a, b) => a.price.amount - b.price.amount,
  );

  if (sorted.length === 0 && warnings.length === 0) {
    warnings.push(
      "No delivery services are available for this route and package configuration.",
    );
  }

  return {
    requestId: createRequestId(),
    generatedAt: new Date().toISOString(),
    weight: internal.weight,
    offers: sorted,
    warnings,
    errors: [],
  };
}

export type QuoteService = {
  getQuote: typeof getQuote;
};

export const quoteService: QuoteService = {
  getQuote,
};
