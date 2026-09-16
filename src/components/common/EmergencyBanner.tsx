'use client';

import React from 'react';
import { PhoneCall, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';

export function EmergencyBanner() {
  const { t } = useTranslation();

  return (
    <div className="bg-emergency-red text-emergency-foreground px-4 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
          <span className="font-semibold tracking-wide">
            {t.hero.emergencyBanner}
          </span>
        </div>
        <div className="flex items-center gap-3 font-medium">
          <a
            href="tel:16263"
            className="flex items-center gap-1 underline underline-offset-2 hover:opacity-90 transition-opacity"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>BD: 16263</span>
          </a>
          <span className="opacity-60">|</span>
          <a
            href="tel:108"
            className="flex items-center gap-1 underline underline-offset-2 hover:opacity-90 transition-opacity"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>IN: 108</span>
          </a>
          <span className="opacity-60">|</span>
          <a
            href="tel:1122"
            className="flex items-center gap-1 underline underline-offset-2 hover:opacity-90 transition-opacity"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>PK: 1122</span>
          </a>
        </div>
      </div>
    </div>
  );
}
