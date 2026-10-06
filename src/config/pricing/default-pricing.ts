import type { PricingEngineConfig } from "@/types/pricing";

/**
 * ZA Courier internal rate card — fictional, admin-replaceable configuration.
 * Inspired by common AU freight quote patterns; not copied from any carrier.
 *
 * Rates are set ~$2–$3 above the previous baseline (express/premium leans +$3).
 *
 * Future: load from database / admin CMS instead of this module.
 */
export const defaultPricingConfig: PricingEngineConfig = {
  version: "2026.09.2",
  currency: "AUD",
  volumetricDivisor: 4000,
  limits: {
    maxWeightKgPerItem: 70,
    maxLengthCm: 200,
    maxGirthCm: 300,
    maxPackages: 20,
  },
  zones: [
    {
      id: "metro_east",
      name: "Eastern Metro",
      states: ["NSW", "VIC", "ACT"],
      postcodePrefixes: ["2", "3"],
    },
    {
      id: "metro_north",
      name: "Northern Metro",
      states: ["QLD"],
      postcodePrefixes: ["4"],
    },
    {
      id: "metro_south",
      name: "Southern Metro",
      states: ["SA", "TAS"],
      postcodePrefixes: ["5", "7"],
    },
    {
      id: "metro_west",
      name: "Western Metro",
      states: ["WA"],
      postcodePrefixes: ["6"],
    },
    {
      id: "remote_nt",
      name: "Northern Territory",
      states: ["NT"],
      postcodePrefixes: ["08", "09"],
      remote: true,
    },
  ],
  remotePostcodePrefixes: ["08", "09", "087", "482", "487", "644", "671"],
  defaultWarrantyNotes:
    "Included transit cover applies to loss or damage during carriage, subject to terms. Excess may apply.",
  rules: [
    {
      id: "za-std-domestic",
      name: "Standard Road",
      active: true,
      carrierId: "za_courier",
      carrierName: "ZA Courier",
      serviceCode: "STD_ROAD",
      serviceLevel: "standard",
      packageTypes: "*",
      route: {},
      priority: 20,
      weightBands: [
        { minKg: 0, maxKg: 1, baseRateAud: 11.5, perKgRateAud: 0 },
        { minKg: 1, maxKg: 5, baseRateAud: 14.8, perKgRateAud: 1.15 },
        { minKg: 5, maxKg: 15, baseRateAud: 18.4, perKgRateAud: 0.95 },
        { minKg: 15, maxKg: 30, baseRateAud: 25.0, perKgRateAud: 0.85 },
        { minKg: 30, maxKg: 70, baseRateAud: 31.5, perKgRateAud: 0.75 },
        { minKg: 70, maxKg: Infinity, baseRateAud: 45.0, perKgRateAud: 0.65 },
      ],
      surcharges: [
        {
          id: "fragile-handling",
          code: "FRAGILE",
          label: "Fragile handling",
          type: "fixed",
          value: 4.5,
          appliesWhen: { packageTypes: ["fragile"] },
        },
        {
          id: "pallet-handling",
          code: "PALLET",
          label: "Pallet handling",
          type: "fixed",
          value: 18,
          appliesWhen: { packageTypes: ["pallet"] },
        },
        {
          id: "remote-area",
          code: "REMOTE",
          label: "Remote area surcharge",
          type: "percent",
          value: 18,
          appliesWhen: { remoteDestination: true },
        },
      ],
      fuelLevyPercent: 8.5,
      minChargeAud: 14.5,
      estimatedDelivery: { minBusinessDays: 2, maxBusinessDays: 5 },
      pickup: {
        available: true,
        cutoffLocalTime: "14:00",
        notes: "Same-day pickup when booked before 2pm local depot time.",
      },
      insurance: {
        included: true,
        coverAmountAud: 100,
        excessAud: 25,
      },
      features: ["Tracked", "Door to door", "Signature on delivery"],
    },
    {
      id: "za-express-domestic",
      name: "Express Priority",
      active: true,
      carrierId: "za_courier",
      carrierName: "ZA Courier",
      serviceCode: "EXP_PRIORITY",
      serviceLevel: "express",
      packageTypes: ["carton", "satchel", "document", "fragile", "other"],
      route: {},
      priority: 10,
      weightBands: [
        { minKg: 0, maxKg: 1, baseRateAud: 17.9, perKgRateAud: 0 },
        { minKg: 1, maxKg: 5, baseRateAud: 21.5, perKgRateAud: 1.65 },
        { minKg: 5, maxKg: 15, baseRateAud: 27.0, perKgRateAud: 1.35 },
        { minKg: 15, maxKg: 30, baseRateAud: 35.5, perKgRateAud: 1.15 },
        { minKg: 30, maxKg: 50, baseRateAud: 45.0, perKgRateAud: 1.05 },
      ],
      surcharges: [
        {
          id: "fragile-express",
          code: "FRAGILE",
          label: "Fragile handling",
          type: "fixed",
          value: 6,
          appliesWhen: { packageTypes: ["fragile"] },
        },
        {
          id: "remote-express",
          code: "REMOTE",
          label: "Remote area surcharge",
          type: "percent",
          value: 22,
          appliesWhen: { remoteDestination: true },
        },
      ],
      fuelLevyPercent: 8.5,
      minChargeAud: 19.9,
      estimatedDelivery: { minBusinessDays: 1, maxBusinessDays: 2 },
      pickup: {
        available: true,
        cutoffLocalTime: "12:00",
        notes: "Express pickup cutoff 12:00 local time.",
      },
      insurance: {
        included: true,
        coverAmountAud: 300,
        excessAud: 25,
      },
      features: [
        "Priority handling",
        "Tracked",
        "Door to door",
        "SMS updates",
      ],
    },
    {
      id: "za-economy-interstate",
      name: "Economy Interstate",
      active: true,
      carrierId: "za_courier",
      carrierName: "ZA Courier",
      serviceCode: "ECO_INTER",
      serviceLevel: "economy",
      packageTypes: ["carton", "satchel", "other", "pallet"],
      route: { interstate: true },
      priority: 30,
      weightBands: [
        { minKg: 0, maxKg: 5, baseRateAud: 12.5, perKgRateAud: 0.85 },
        { minKg: 5, maxKg: 20, baseRateAud: 15.8, perKgRateAud: 0.7 },
        { minKg: 20, maxKg: 70, baseRateAud: 21.5, perKgRateAud: 0.55 },
        { minKg: 70, maxKg: Infinity, baseRateAud: 31.0, perKgRateAud: 0.48 },
      ],
      surcharges: [
        {
          id: "remote-economy",
          code: "REMOTE",
          label: "Remote area surcharge",
          type: "percent",
          value: 15,
          appliesWhen: { remoteDestination: true },
        },
      ],
      fuelLevyPercent: 8.5,
      minChargeAud: 13.0,
      estimatedDelivery: { minBusinessDays: 4, maxBusinessDays: 8 },
      pickup: {
        available: true,
        cutoffLocalTime: "15:00",
        notes: "Economy pickups Monday–Friday.",
      },
      insurance: {
        included: true,
        coverAmountAud: 50,
        excessAud: 25,
      },
      features: ["Tracked", "Depot network", "Best value"],
    },
    {
      id: "za-same-state-runner",
      name: "Metro Same-State",
      active: true,
      carrierId: "za_courier",
      carrierName: "ZA Courier",
      serviceCode: "METRO_SS",
      serviceLevel: "priority",
      packageTypes: ["carton", "satchel", "document", "fragile", "other"],
      route: { sameState: true },
      priority: 5,
      weightBands: [
        { minKg: 0, maxKg: 2, baseRateAud: 13.2, perKgRateAud: 0 },
        { minKg: 2, maxKg: 10, baseRateAud: 15.9, perKgRateAud: 1.1 },
        { minKg: 10, maxKg: 25, baseRateAud: 21.5, perKgRateAud: 0.9 },
      ],
      surcharges: [],
      fuelLevyPercent: 7.5,
      minChargeAud: 13.2,
      estimatedDelivery: { minBusinessDays: 1, maxBusinessDays: 1 },
      pickup: {
        available: true,
        cutoffLocalTime: "13:00",
        notes: "Next-business-day metro delivery when booked before 1pm.",
      },
      insurance: {
        included: true,
        coverAmountAud: 150,
        excessAud: 20,
      },
      features: ["Same-state priority", "Tracked", "Door to door"],
    },
    {
      id: "partner-demo-linehaul",
      name: "Partner Linehaul",
      active: true,
      carrierId: "partner_demo",
      carrierName: "Partner Linehaul",
      serviceCode: "PL_LINE",
      serviceLevel: "standard",
      packageTypes: ["carton", "pallet", "other"],
      route: { interstate: true },
      priority: 40,
      weightBands: [
        { minKg: 0, maxKg: 10, baseRateAud: 17.0, perKgRateAud: 1.0 },
        { minKg: 10, maxKg: 40, baseRateAud: 21.5, perKgRateAud: 0.8 },
        { minKg: 40, maxKg: Infinity, baseRateAud: 33.0, perKgRateAud: 0.7 },
      ],
      surcharges: [
        {
          id: "partner-remote",
          code: "REMOTE",
          label: "Remote area surcharge",
          type: "fixed",
          value: 12,
          appliesWhen: { remoteDestination: true },
        },
      ],
      fuelLevyPercent: 9,
      minChargeAud: 18,
      estimatedDelivery: { minBusinessDays: 3, maxBusinessDays: 6 },
      pickup: {
        available: false,
        notes: "Drop-off at partner depot required for this service.",
      },
      insurance: {
        included: false,
        coverAmountAud: 0,
        notes: "Optional cover available at booking.",
      },
      features: ["Multi-carrier network", "Tracked", "Business friendly"],
    },
  ],
};

/** Swap this loader for a DB/admin fetch later. */
export async function loadPricingConfig(): Promise<PricingEngineConfig> {
  return defaultPricingConfig;
}
