import type {
  CarrierAdapter,
  NormalizedQuoteOffer,
  QuoteRequest,
} from "@/types/pricing";
import { calculateInternalQuotes } from "@/lib/pricing/engine";
import { loadPricingConfig } from "@/config/pricing/default-pricing";

/**
 * Internal ZA Courier engine exposed as a carrier adapter.
 * External courier APIs (future) implement the same CarrierAdapter contract
 * and return NormalizedQuoteOffer[] so the UI stays carrier-agnostic.
 */
export const internalCarrierAdapter: CarrierAdapter = {
  id: "za_courier",
  name: "ZA Courier",
  enabled: true,
  async getRates(request: QuoteRequest): Promise<NormalizedQuoteOffer[]> {
    const config = await loadPricingConfig();
    const result = calculateInternalQuotes(request, config);
    return result.offers.filter((offer) => offer.carrierId === "za_courier");
  },
};

/**
 * Demo partner adapter — currently also driven by the internal config
 * (partner_demo rules). Replace getRates() with a real HTTP integration later.
 */
export const partnerDemoAdapter: CarrierAdapter = {
  id: "partner_demo",
  name: "Partner Linehaul",
  enabled: true,
  async getRates(request: QuoteRequest): Promise<NormalizedQuoteOffer[]> {
    const config = await loadPricingConfig();
    const result = calculateInternalQuotes(request, config);
    return result.offers
      .filter((offer) => offer.carrierId === "partner_demo")
      .map((offer) => ({
        ...offer,
        source: "external_carrier" as const,
      }));
  },
};

/**
 * Placeholder for a future third-party courier API integration.
 * Keep disabled until credentials and mapping are ready.
 */
export const externalCarrierStubAdapter: CarrierAdapter = {
  id: "external_stub",
  name: "External Courier API",
  enabled: false,
  async getRates(request: QuoteRequest): Promise<NormalizedQuoteOffer[]> {
    void request;
    // Future: call external API, map response → NormalizedQuoteOffer[]
    return [];
  },
};

export function getEnabledCarrierAdapters(): CarrierAdapter[] {
  return [
    internalCarrierAdapter,
    partnerDemoAdapter,
    externalCarrierStubAdapter,
  ].filter((adapter) => adapter.enabled);
}
