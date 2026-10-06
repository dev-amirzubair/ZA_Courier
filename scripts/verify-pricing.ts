import { calculateInternalQuotes } from "@/lib/pricing/engine";
import { defaultPricingConfig } from "@/config/pricing/default-pricing";
import { summarisePackageWeights } from "@/lib/pricing/weight";
import type { QuoteRequest } from "@/types/pricing";

/**
 * Lightweight self-check for the pricing engine.
 * Run: npx tsx scripts/verify-pricing.ts
 */
const sample: QuoteRequest = {
  origin: { suburb: "Melbourne", state: "VIC", postcode: "3000" },
  destination: { suburb: "Sydney", state: "NSW", postcode: "2000" },
  packages: [
    {
      id: "pkg_a",
      packageType: "carton",
      quantity: 1,
      weightKg: 5,
      dimensions: { lengthCm: 40, widthCm: 30, heightCm: 20 },
    },
    {
      id: "pkg_b",
      packageType: "carton",
      quantity: 2,
      weightKg: 2,
      dimensions: { lengthCm: 50, widthCm: 40, heightCm: 40 },
    },
  ],
  declaredValueAud: 250,
  pickupRequired: true,
};

const weight = summarisePackageWeights(
  sample.packages,
  defaultPricingConfig.volumetricDivisor,
);

const result = calculateInternalQuotes(sample, defaultPricingConfig);

console.log("Volumetric divisor:", weight.volumetricDivisor);
console.log("Actual kg:", weight.totalActualWeightKg);
console.log("Volumetric kg:", weight.totalVolumetricWeightKg);
console.log("Chargeable kg:", weight.totalChargeableWeightKg);
console.log(
  "Offers:",
  result.offers.map((o) => `${o.serviceName}=$${o.price.amount}`).join(", "),
);

if (weight.totalChargeableWeightKg < weight.totalActualWeightKg) {
  throw new Error("Chargeable weight must be >= actual weight");
}

if (result.offers.length === 0) {
  throw new Error("Expected at least one offer for Melbourne → Sydney");
}

console.log("Pricing engine verification passed.");
