import type {
  PackageDimensions,
  PackageWeightBreakdown,
  QuotePackageInput,
  QuoteWeightSummary,
} from "@/types/pricing";

export function volumeCm3(dimensions: PackageDimensions): number {
  return dimensions.lengthCm * dimensions.widthCm * dimensions.heightCm;
}

/**
 * Volumetric (cubic) weight in kg.
 * Formula: (L × W × H cm) / divisor
 */
export function volumetricWeightKg(
  dimensions: PackageDimensions,
  divisor: number,
): number {
  if (divisor <= 0) {
    throw new Error("Volumetric divisor must be greater than zero.");
  }

  return volumeCm3(dimensions) / divisor;
}

export function chargeableWeightKg(
  actualWeightKg: number,
  volumetricKg: number,
): { chargeableWeightKg: number; usedVolumetric: boolean } {
  const usedVolumetric = volumetricKg > actualWeightKg;
  return {
    chargeableWeightKg: Math.max(actualWeightKg, volumetricKg),
    usedVolumetric,
  };
}

export function summarisePackageWeights(
  packages: QuotePackageInput[],
  volumetricDivisor: number,
): QuoteWeightSummary {
  const breakdown: PackageWeightBreakdown[] = packages.map((pkg) => {
    const actualPerItem = pkg.weightKg;
    const volumetricPerItem = volumetricWeightKg(
      pkg.dimensions,
      volumetricDivisor,
    );
    const { chargeableWeightKg: chargeablePerItem, usedVolumetric } =
      chargeableWeightKg(actualPerItem, volumetricPerItem);

    return {
      packageId: pkg.id,
      packageType: pkg.packageType,
      quantity: pkg.quantity,
      actualWeightKg: roundWeight(actualPerItem * pkg.quantity),
      volumetricWeightKg: roundWeight(volumetricPerItem * pkg.quantity),
      chargeableWeightKg: roundWeight(chargeablePerItem * pkg.quantity),
      volumeCm3: volumeCm3(pkg.dimensions) * pkg.quantity,
      usedVolumetric,
    };
  });

  return {
    packages: breakdown,
    totalActualWeightKg: roundWeight(
      breakdown.reduce((sum, item) => sum + item.actualWeightKg, 0),
    ),
    totalVolumetricWeightKg: roundWeight(
      breakdown.reduce((sum, item) => sum + item.volumetricWeightKg, 0),
    ),
    totalChargeableWeightKg: roundWeight(
      breakdown.reduce((sum, item) => sum + item.chargeableWeightKg, 0),
    ),
    totalItems: packages.reduce((sum, pkg) => sum + pkg.quantity, 0),
    volumetricDivisor,
  };
}

export function roundWeight(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
