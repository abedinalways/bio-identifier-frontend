'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { SupportedLocale } from '../config/i18n.config';
import type { TranslationDictionary } from './dictionaries/en';
import { getDictionary } from './getDictionary';
import { isRTL } from '../config/i18n.config';

interface LocaleContextType {
  locale: SupportedLocale;
  t: TranslationDictionary;
  isRtl: boolean;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: SupportedLocale;
  children: React.ReactNode;
}) {
  const t = useMemo(() => getDictionary(locale), [locale]);
  const isRtl = useMemo(() => isRTL(locale), [locale]);

  return (
    <LocaleContext.Provider value={{ locale, t, isRtl }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    // Fallback if rendered outside provider
    const fallbackT = getDictionary('en');
    return { locale: 'en', t: fallbackT, isRtl: false };
  }
  return context;
}
