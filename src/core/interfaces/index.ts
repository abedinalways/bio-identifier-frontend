import type {
  DangerLevel,
  VenomCategory,
  PestSeverity,
  CropType,
  PesticideType,
  RegionalName,
} from '../types';

export interface IVenomProfile {
  isVenomous: boolean;
  dangerLevel: DangerLevel;
  venomCategory: VenomCategory;
  antivenomRequired: boolean;
  antivenomType: string;
  commercialBrands: string[];
  targetToxins: string[];
  lethalityRisk: string;
}

export interface ISnake {
  id: string;
  commonName: RegionalName;
  scientificName: string;
  family: string;
  venomProfile: IVenomProfile;
  habitat: string;
  distribution: string[];
  imageUrl: string;
  firstAidSteps: string[];
  mythsDebunked: string[];
  ecologicalImportance: string;
}

export interface IPestDamageProfile {
  affectedCrops: CropType[];
  severity: PestSeverity;
  symptoms: string[];
  damageMechanism: string;
  yieldLossPotential: string;
}

export interface IPesticideRecommendation {
  id: string;
  type: PesticideType;
  title: string;
  activeIngredient: string;
  dosagePerLiter: number;
  dosageUnit: 'ml' | 'g';
  commercialExamples: string[];
  optimalTiming: string;
  preHarvestIntervalDays: number;
  safetyInstructions: string;
}

export interface IPest {
  id: string;
  commonName: RegionalName;
  scientificName: string;
  damageProfile: IPestDamageProfile;
  treatments: IPesticideRecommendation[];
  imageUrl: string;
  category?: 'crop_pest' | 'stinging_insect';
  stingRemedy?: string;
}

export interface IIdentificationResult {
  id: string;
  type: 'snake' | 'pest';
  confidence: number;
  analyzedAt: string;
  snakeData?: ISnake;
  pestData?: IPest;
  alternativeMatches?: Array<{ name: string; confidence: number }>;
}

export interface IEmergencyHospital {
  id: string;
  name: string;
  country: 'BD' | 'IN' | 'PK';
  district: string;
  division?: string;
  hotline: string;
  hasAntivenomStock: boolean;
  address: string;
  latitude: number;
  longitude: number;
  emergencyUnit?: string;
  icuAvailable?: boolean;
}
