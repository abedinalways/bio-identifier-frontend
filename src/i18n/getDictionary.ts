import { en } from './dictionaries/en';
import { bn } from './dictionaries/bn';
import { hi } from './dictionaries/hi';
import { ur } from './dictionaries/ur';
import { zh } from './dictionaries/zh';
import { th } from './dictionaries/th';
import type { TranslationDictionary } from './dictionaries/en';
import type { SupportedLocale } from '../config/i18n.config';

const dictionaries: Record<SupportedLocale, TranslationDictionary> = {
  en,
  bn,
  hi,
  ur,
  zh,
  th,
};

export function getDictionary(locale: string): TranslationDictionary {
  if (locale in dictionaries) {
    return dictionaries[locale as SupportedLocale];
  }
  return dictionaries.en;
}
