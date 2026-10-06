/**
 * Domain types for quote/pricing.
 * Kept UI-agnostic so admin tooling and carrier adapters can share them.
 */

export type PackageType =
  | "carton"
  | "satchel"
  | "document"
  | "pallet"
  | "fragile"
  | "other";

export type ServiceLevel =
  | "standard"
  | "express"
  | "priority"
  | "economy"
  | "same_day";

export type CurrencyCode = "AUD";

export interface PackageDimensions {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export interface QuotePackageInput {
  id: string;
  packageType: PackageType;
  quantity: number;
  weightKg: number;
  dimensions: PackageDimensions;
  description?: string;
}

export interface AddressRef {
  suburb: string;
  state: string;
  postcode: string;
  country?: "AU";
}

export interface QuoteRequest {
  origin: AddressRef;
  destination: AddressRef;
  packages: QuotePackageInput[];
  declaredValueAud?: number;
  pickupRequired?: boolean;
  preferredServiceLevels?: ServiceLevel[];
}

export interface PackageWeightBreakdown {
  packageId: string;
  packageType: PackageType;
  quantity: number;
  actualWeightKg: number;
  volumetricWeightKg: number;
  chargeableWeightKg: number;
  volumeCm3: number;
  usedVolumetric: boolean;
}

export interface QuoteWeightSummary {
  packages: PackageWeightBreakdown[];
  totalActualWeightKg: number;
  totalVolumetricWeightKg: number;
  totalChargeableWeightKg: number;
  totalItems: number;
  volumetricDivisor: number;
}

export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export interface PriceBreakdownLine {
  code: string;
  label: string;
  amount: Money;
  meta?: Record<string, string | number | boolean>;
}

export interface InsuranceInfo {
  included: boolean;
  coverAmountAud: number;
  excessAud?: number;
  notes?: string;
}

export interface NormalizedQuoteOffer {
  id: string;
  carrierId: string;
  carrierName: string;
  serviceCode: string;
  serviceName: string;
  serviceLevel: ServiceLevel;
  price: Money;
  breakdown: PriceBreakdownLine[];
  estimatedDelivery: {
    minBusinessDays: number;
    maxBusinessDays: number;
    label: string;
  };
  pickup: {
    available: boolean;
    cutoffLocalTime?: string;
    notes?: string;
  };
  insurance: InsuranceInfo;
  features: string[];
  chargeableWeightKg: number;
  source: "internal_engine" | "external_carrier";
  rawCarrierPayload?: unknown;
}

export interface QuoteResult {
  requestId: string;
  generatedAt: string;
  weight: QuoteWeightSummary;
  offers: NormalizedQuoteOffer[];
  warnings: string[];
  errors: string[];
}

/** Admin-configurable pricing configuration */

export interface WeightBand {
  minKg: number;
  maxKg: number; // exclusive upper bound except Infinity for open-ended
  baseRateAud: number;
  perKgRateAud: number;
}

export interface RouteMatcher {
  /** Match by Australian state codes, e.g. VIC → NSW */
  originStates?: string[];
  destinationStates?: string[];
  /** Match by postcode prefix, e.g. "3", "20" */
  originPostcodePrefixes?: string[];
  destinationPostcodePrefixes?: string[];
  /** Zone ids from zone table */
  originZones?: string[];
  destinationZones?: string[];
  /** Same-state / interstate helpers */
  sameState?: boolean;
  interstate?: boolean;
}

export interface SurchargeRule {
  id: string;
  code: string;
  label: string;
  /** Fixed fee or percentage of subtotal */
  type: "fixed" | "per_kg" | "percent";
  value: number;
  appliesWhen?: {
    packageTypes?: PackageType[];
    minChargeableWeightKg?: number;
    maxChargeableWeightKg?: number;
    serviceLevels?: ServiceLevel[];
    remoteDestination?: boolean;
  };
}

export interface ServiceRateRule {
  id: string;
  name: string;
  active: boolean;
  carrierId: string;
  carrierName: string;
  serviceCode: string;
  serviceLevel: ServiceLevel;
  packageTypes: PackageType[] | "*";
  route: RouteMatcher;
  weightBands: WeightBand[];
  surcharges: SurchargeRule[];
  fuelLevyPercent: number;
  minChargeAud: number;
  estimatedDelivery: {
    minBusinessDays: number;
    maxBusinessDays: number;
  };
  pickup: {
    available: boolean;
    cutoffLocalTime?: string;
    notes?: string;
  };
  insurance: InsuranceInfo;
  features: string[];
  priority: number;
}

export interface ZoneDefinition {
  id: string;
  name: string;
  states?: string[];
  postcodePrefixes?: string[];
  postcodes?: string[];
  remote?: boolean;
}

export interface PricingEngineConfig {
  version: string;
  currency: CurrencyCode;
  /** cm³ → kg divisor. AU domestic commonly 4000 or 5000. */
  volumetricDivisor: number;
  /** Caps and validation */
  limits: {
    maxWeightKgPerItem: number;
    maxLengthCm: number;
    maxGirthCm: number;
    maxPackages: number;
  };
  zones: ZoneDefinition[];
  remotePostcodePrefixes: string[];
  rules: ServiceRateRule[];
  /** Optional default warranty copy shown when insurance is included */
  defaultWarrantyNotes: string;
}

export interface CarrierAdapter {
  id: string;
  name: string;
  enabled: boolean;
  getRates(request: QuoteRequest): Promise<NormalizedQuoteOffer[]>;
}
