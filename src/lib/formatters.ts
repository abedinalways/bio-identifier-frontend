/**
 * Mathematical dilution and dosage calculations for agricultural knapsack sprayers.
 */

export interface DosageCalculationParams {
  tankSizeLiters: number;
  recommendedDosePerLiter: number;
  unit: 'ml' | 'g';
}

export interface DosageCalculationResult {
  totalQuantity: number;
  unit: 'ml' | 'g';
  waterLiters: number;
  displayText: string;
}

export function calculateSprayerDosage(
  params: DosageCalculationParams,
): DosageCalculationResult {
  const total = Number(
    (params.tankSizeLiters * params.recommendedDosePerLiter).toFixed(2),
  );
  return {
    totalQuantity: total,
    unit: params.unit,
    waterLiters: params.tankSizeLiters,
    displayText: `${total} ${params.unit} for ${params.tankSizeLiters} Liters of water`,
  };
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}
