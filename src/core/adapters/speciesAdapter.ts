import type {
  ISnake,
  IPest,
  IEmergencyHospital,
  IIdentificationResult,
  IVenomProfile,
  IPestDamageProfile,
  IPesticideRecommendation,
} from '../interfaces';
import type {
  DangerLevel,
  VenomCategory,
  PestSeverity,
  CropType,
} from '../types';

/**
 * Safely adapts a Prisma Snake entity or nested snake model into the standard ISnake interface.
 */
export function adaptPrismaSnake(raw: any): ISnake {
  if (!raw) return raw;

  // Already adapted
  if (raw.venomProfile && raw.commonName) {
    return raw as ISnake;
  }

  const commonName = raw.commonName ||
    raw.commonNames || {
      en: raw.scientificName || 'Unknown Snake',
      bn: raw.scientificName || 'অজানা সাপ',
    };

  const venomProfile: IVenomProfile = raw.venomProfile || {
    isVenomous: Boolean(raw.isVenomous),
    dangerLevel:
      (raw.dangerLevel as DangerLevel) ||
      (raw.isVenomous ? 'deadly' : 'harmless'),
    venomCategory:
      (raw.venomCategory as VenomCategory) ||
      (raw.isVenomous ? 'neurotoxic' : 'non_venomous'),
    antivenomRequired: Boolean(raw.antivenomRequired),
    antivenomType:
      raw.antivenomType ||
      (raw.isVenomous ? 'Polyvalent Anti-Snake Venom (ASV)' : 'None (Safe)'),
    commercialBrands: Array.isArray(raw.commercialBrands)
      ? raw.commercialBrands
      : [],
    targetToxins: Array.isArray(raw.targetToxins) ? raw.targetToxins : [],
    lethalityRisk:
      raw.lethalityRisk ||
      (raw.isVenomous ? 'Critical Envenomation Risk' : 'Non-lethal / Harmless'),
  };

  return {
    id: raw.id || `snake-${Date.now()}`,
    commonName,
    scientificName: raw.scientificName || 'Species Unknown',
    family: raw.family || 'Squamata',
    venomProfile,
    habitat: raw.habitat || 'Forests, fields, wetlands',
    distribution: Array.isArray(raw.distribution)
      ? raw.distribution
      : ['South Asia'],
    imageUrl:
      raw.imageUrl ||
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    firstAidSteps:
      Array.isArray(raw.firstAidSteps) && raw.firstAidSteps.length > 0
        ? raw.firstAidSteps
        : [
            'Immobilize the bitten limb immediately with a splint. Avoid movement.',
            'Do NOT tie tight tourniquets; this accelerates tissue damage.',
            'Rush immediately to an emergency hospital with ASV facilities.',
          ],
    mythsDebunked: Array.isArray(raw.mythsDebunked) ? raw.mythsDebunked : [],
    ecologicalImportance:
      raw.ecologicalImportance ||
      'Keeps rodent and pest populations under natural control.',
  };
}

/**
 * Safely adapts a Prisma Pest entity or nested pest model into the standard IPest interface.
 */
export function adaptPrismaPest(raw: any): IPest {
  if (!raw) return raw;

  // Already adapted
  if (raw.damageProfile && raw.commonName) {
    return raw as IPest;
  }

  const commonName = raw.commonName ||
    raw.commonNames || {
      en: raw.scientificName || 'Unknown Pest',
      bn: raw.scientificName || 'অজানা কীট',
    };

  const damageProfile: IPestDamageProfile = raw.damageProfile || {
    affectedCrops: (Array.isArray(raw.affectedCrops)
      ? raw.affectedCrops
      : ['rice']) as CropType[],
    severity: (raw.severity as PestSeverity) || 'critical',
    symptoms: Array.isArray(raw.symptoms)
      ? raw.symptoms
      : ['Crop tissue damage', 'Leaves withering'],
    damageMechanism:
      raw.damageMechanism ||
      'Sap depletion or larval tunneling within crop canopy.',
    yieldLossPotential:
      raw.yieldLossPotential ||
      'Significant commercial yield reduction if untreated.',
  };

  const treatments: IPesticideRecommendation[] = Array.isArray(raw.treatments)
    ? raw.treatments.map((t: any, idx: number) => ({
        id: t.id || `treat-${idx}`,
        type: t.type || 'organic',
        title: t.title || 'Recommended Treatment Protocol',
        activeIngredient: t.activeIngredient || 'Bio-Botanical Extract',
        dosagePerLiter:
          typeof t.dosagePerLiter === 'number' ? t.dosagePerLiter : 1.0,
        dosageUnit: t.dosageUnit === 'g' ? 'g' : 'ml',
        commercialExamples: Array.isArray(t.commercialExamples)
          ? t.commercialExamples
          : [],
        optimalTiming:
          t.optimalTiming || 'Spray early morning or late afternoon.',
        preHarvestIntervalDays:
          typeof t.preHarvestIntervalDays === 'number'
            ? t.preHarvestIntervalDays
            : 0,
        safetyInstructions:
          t.safetyInstructions ||
          'Wear standard protective equipment during application.',
      }))
    : [];

  return {
    id: raw.id || `pest-${Date.now()}`,
    commonName,
    scientificName: raw.scientificName || 'Invertebrate Pest',
    damageProfile,
    treatments,
    imageUrl:
      raw.imageUrl ||
      'https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&w=800&q=80',
    category: raw.category || 'crop_pest',
    stingRemedy: raw.stingRemedy || undefined,
  };
}

/**
 * Safely adapts a Prisma Hospital entity into IEmergencyHospital.
 */
export function adaptPrismaHospital(raw: any): IEmergencyHospital {
  return {
    id: raw.id || `hosp-${Date.now()}`,
    name: raw.name || 'Emergency Toxicology Center',
    country: (raw.country as 'BD' | 'IN' | 'PK') || 'BD',
    district: raw.district || 'Regional',
    division: raw.division,
    hotline: raw.hotline || '+880255165088',
    hasAntivenomStock: raw.hasAntivenomStock !== false,
    address: raw.address || 'Civil Hospital Emergency Ward',
    latitude: typeof raw.latitude === 'number' ? raw.latitude : 23.7,
    longitude: typeof raw.longitude === 'number' ? raw.longitude : 90.4,
    emergencyUnit: raw.emergencyUnit,
    icuAvailable: raw.icuAvailable !== false,
  };
}

/**
 * Adapts the NestJS /identify/analyze response into the standard IIdentificationResult.
 */
export function adaptIdentificationResult(raw: any): IIdentificationResult {
  if (!raw) {
    throw new Error(
      'Empty diagnostic response received from identification engine',
    );
  }

  // Handle both { success: true, data: { ... } } and direct payload
  const payload = raw.data || raw;
  const isSnake =
    payload.type === 'snake' ||
    payload.detectedDomain === 'snake' ||
    (!payload.type && payload.matchedSpecies?.isVenomous !== undefined);

  let snakeData: ISnake | undefined = undefined;
  let pestData: IPest | undefined = undefined;

  if (payload.matchedSpecies) {
    if (isSnake) {
      snakeData = adaptPrismaSnake(payload.matchedSpecies);
    } else {
      pestData = adaptPrismaPest(payload.matchedSpecies);
    }
  } else if (payload.analysis) {
    if (isSnake) {
      snakeData = adaptPrismaSnake({
        id: payload.analysis.speciesId || 'identified-snake',
        scientificName: payload.analysis.scientificName,
        commonNames: {
          en: payload.analysis.commonNameEn || payload.analysis.scientificName,
          bn: payload.analysis.commonNameBn || payload.analysis.scientificName,
        },
        isVenomous: payload.analysis.isVenomous,
        dangerLevel: payload.analysis.dangerLevel,
        venomCategory: payload.analysis.venomCategory,
        antivenomRequired:
          payload.analysis.nearestASVRecommended ?? payload.analysis.isVenomous,
        firstAidSteps: payload.analysis.firstAidRemedy
          ? [payload.analysis.firstAidRemedy]
          : undefined,
        lethalityRisk: payload.analysis.clinicalRisk,
      });
    } else {
      pestData = adaptPrismaPest({
        id: payload.analysis.pestId || 'identified-pest',
        scientificName: payload.analysis.scientificName,
        commonNames: {
          en: payload.analysis.commonNameEn || payload.analysis.scientificName,
          bn: payload.analysis.commonNameBn || payload.analysis.scientificName,
        },
        category: payload.analysis.category,
        severity: payload.analysis.severity,
        symptoms: payload.analysis.symptoms,
      });
    }
  }

  return {
    id: payload.identificationId || `diag-${Date.now()}`,
    type: isSnake ? 'snake' : 'pest',
    confidence:
      typeof payload.confidence === 'number' ? payload.confidence : 0.94,
    analyzedAt: payload.timestamp || new Date().toISOString(),
    snakeData,
    pestData,
    alternativeMatches: payload.alternativeMatches || [],
  };
}
