import type {
  NormalizedQuoteOffer,
  PriceBreakdownLine,
  PricingEngineConfig,
  QuoteRequest,
  QuoteResult,
  QuoteWeightSummary,
  ServiceRateRule,
  SurchargeRule,
} from "@/types/pricing";
import {
  findMatchingRules,
  formatDeliveryLabel,
  isRemoteDestination,
} from "@/lib/pricing/route";
import { roundMoney, summarisePackageWeights } from "@/lib/pricing/weight";

function findWeightBand(rule: ServiceRateRule, chargeableKg: number) {
  return rule.weightBands.find(
    (band) => chargeableKg >= band.minKg && chargeableKg < band.maxKg,
  );
}

function appliesSurcharge(
  surcharge: SurchargeRule,
  args: {
    rule: ServiceRateRule;
    chargeableKg: number;
    packages: QuoteRequest["packages"];
    remote: boolean;
  },
): boolean {
  const when = surcharge.appliesWhen;
  if (!when) {
    return true;
  }

  if (
    when.packageTypes &&
    !args.packages.every((pkg) => when.packageTypes!.includes(pkg.packageType))
  ) {
    return false;
  }

  if (
    when.minChargeableWeightKg !== undefined &&
    args.chargeableKg < when.minChargeableWeightKg
  ) {
    return false;
  }

  if (
    when.maxChargeableWeightKg !== undefined &&
    args.chargeableKg > when.maxChargeableWeightKg
  ) {
    return false;
  }

  if (
    when.serviceLevels &&
    !when.serviceLevels.includes(args.rule.serviceLevel)
  ) {
    return false;
  }

  if (when.remoteDestination === true && !args.remote) {
    return false;
  }

  if (when.remoteDestination === false && args.remote) {
    return false;
  }

  return true;
}

function computeSurchargeAmount(
  surcharge: SurchargeRule,
  subtotal: number,
  chargeableKg: number,
): number {
  switch (surcharge.type) {
    case "fixed":
      return surcharge.value;
    case "per_kg":
      return surcharge.value * chargeableKg;
    case "percent":
      return subtotal * (surcharge.value / 100);
    default:
      return 0;
  }
}

function validateRequestAgainstLimits(
  request: QuoteRequest,
  config: PricingEngineConfig,
): string[] {
  const errors: string[] = [];

  if (request.packages.length > config.limits.maxPackages) {
    errors.push(
      `A maximum of ${config.limits.maxPackages} package lines is supported.`,
    );
  }

  for (const pkg of request.packages) {
    if (pkg.weightKg > config.limits.maxWeightKgPerItem) {
      errors.push(
        `Package "${pkg.id}" exceeds the ${config.limits.maxWeightKgPerItem} kg item limit.`,
      );
    }

    const { lengthCm, widthCm, heightCm } = pkg.dimensions;
    const longest = Math.max(lengthCm, widthCm, heightCm);
    if (longest > config.limits.maxLengthCm) {
      errors.push(
        `Package "${pkg.id}" exceeds the ${config.limits.maxLengthCm} cm length limit.`,
      );
    }

    const girth = lengthCm + 2 * (widthCm + heightCm);
    if (girth > config.limits.maxGirthCm) {
      errors.push(
        `Package "${pkg.id}" exceeds the ${config.limits.maxGirthCm} cm girth limit.`,
      );
    }
  }

  return errors;
}

function priceRule(
  rule: ServiceRateRule,
  request: QuoteRequest,
  weight: QuoteWeightSummary,
  config: PricingEngineConfig,
): { offer: NormalizedQuoteOffer | null; warning?: string } {
  const chargeableKg = weight.totalChargeableWeightKg;
  const band = findWeightBand(rule, chargeableKg);

  if (!band) {
    return {
      offer: null,
      warning: `${rule.name} has no rate band for ${chargeableKg} kg.`,
    };
  }

  const remote = isRemoteDestination(request.destination, config);
  const freight = band.baseRateAud + band.perKgRateAud * chargeableKg;
  const breakdown: PriceBreakdownLine[] = [
    {
      code: "FREIGHT",
      label: `Freight (${chargeableKg} kg chargeable)`,
      amount: { amount: roundMoney(freight), currency: config.currency },
      meta: {
        baseRateAud: band.baseRateAud,
        perKgRateAud: band.perKgRateAud,
        bandMinKg: band.minKg,
        bandMaxKg: band.maxKg,
      },
    },
  ];

  let running = freight;

  for (const surcharge of rule.surcharges) {
    if (
      !appliesSurcharge(surcharge, {
        rule,
        chargeableKg,
        packages: request.packages,
        remote,
      })
    ) {
      continue;
    }

    const amount = computeSurchargeAmount(surcharge, running, chargeableKg);
    if (amount <= 0) {
      continue;
    }

    breakdown.push({
      code: surcharge.code,
      label: surcharge.label,
      amount: { amount: roundMoney(amount), currency: config.currency },
    });
    running += amount;
  }

  if (rule.fuelLevyPercent > 0) {
    const fuel = running * (rule.fuelLevyPercent / 100);
    breakdown.push({
      code: "FUEL",
      label: `Fuel levy (${rule.fuelLevyPercent}%)`,
      amount: { amount: roundMoney(fuel), currency: config.currency },
    });
    running += fuel;
  }

  if (running < rule.minChargeAud) {
    const uplift = rule.minChargeAud - running;
    breakdown.push({
      code: "MIN_CHARGE",
      label: "Minimum charge adjustment",
      amount: { amount: roundMoney(uplift), currency: config.currency },
    });
    running = rule.minChargeAud;
  }

  const insurance: NormalizedQuoteOffer["insurance"] = {
    ...rule.insurance,
    notes: rule.insurance.notes ?? config.defaultWarrantyNotes,
  };

  if (
    request.declaredValueAud &&
    insurance.included &&
    request.declaredValueAud > insurance.coverAmountAud
  ) {
    breakdown.push({
      code: "EXTRA_COVER_HINT",
      label: "Declared value exceeds included cover — extra cover available at booking",
      amount: { amount: 0, currency: config.currency },
      meta: {
        declaredValueAud: request.declaredValueAud,
        includedCoverAud: insurance.coverAmountAud,
      },
    });
  }

  const offer: NormalizedQuoteOffer = {
    id: `${rule.carrierId}:${rule.serviceCode}:${rule.id}`,
    carrierId: rule.carrierId,
    carrierName: rule.carrierName,
    serviceCode: rule.serviceCode,
    serviceName: rule.name,
    serviceLevel: rule.serviceLevel,
    price: { amount: roundMoney(running), currency: config.currency },
    breakdown,
    estimatedDelivery: {
      minBusinessDays: rule.estimatedDelivery.minBusinessDays,
      maxBusinessDays: rule.estimatedDelivery.maxBusinessDays,
      label: formatDeliveryLabel(
        rule.estimatedDelivery.minBusinessDays,
        rule.estimatedDelivery.maxBusinessDays,
      ),
    },
    pickup: { ...rule.pickup },
    insurance,
    features: [...rule.features],
    chargeableWeightKg: chargeableKg,
    source: "internal_engine",
  };

  return { offer };
}

/**
 * Configurable internal pricing engine.
 * Rates come from PricingEngineConfig — never from UI components.
 */
export function calculateInternalQuotes(
  request: QuoteRequest,
  config: PricingEngineConfig,
): QuoteResult {
  const requestId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `quote_${Date.now()}`;

  const errors = validateRequestAgainstLimits(request, config);
  const weight = summarisePackageWeights(
    request.packages,
    config.volumetricDivisor,
  );

  if (errors.length > 0) {
    return {
      requestId,
      generatedAt: new Date().toISOString(),
      weight,
      offers: [],
      warnings: [],
      errors,
    };
  }

  const matched = findMatchingRules(request, config);
  const warnings: string[] = [];
  const offers: NormalizedQuoteOffer[] = [];

  if (matched.length === 0) {
    warnings.push(
      "No services are currently available for this origin, destination and package mix.",
    );
  }

  for (const rule of matched) {
    const priced = priceRule(rule, request, weight, config);
    if (priced.warning) {
      warnings.push(priced.warning);
    }
    if (priced.offer) {
      offers.push(priced.offer);
    }
  }

  offers.sort((a, b) => a.price.amount - b.price.amount);

  return {
    requestId,
    generatedAt: new Date().toISOString(),
    weight,
    offers,
    warnings,
    errors: [],
  };
}
