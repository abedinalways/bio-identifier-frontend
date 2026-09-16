export type DangerLevel = 'deadly' | 'mild' | 'harmless';

export type VenomCategory =
  | 'neurotoxic'
  | 'hemotoxic'
  | 'cytotoxic'
  | 'non_venomous';

export type PestSeverity = 'critical' | 'moderate' | 'low';

export type CropType =
  | 'mango'
  | 'litchi'
  | 'rice'
  | 'potato'
  | 'vegetables'
  | 'guava'
  | 'jute'
  | 'cotton'
  | 'other';

export type PesticideType = 'organic' | 'chemical' | 'biological';

export interface RegionalName {
  en: string;
  bn?: string;
  hi?: string;
  ur?: string;
  zh?: string;
  th?: string;
}
