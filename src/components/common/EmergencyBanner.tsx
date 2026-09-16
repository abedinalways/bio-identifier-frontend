'use client';

import React from 'react';
import { PhoneCall } from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';

export function EmergencyBanner() {
  const { t } = useTranslation();

  return (
    <div className="bg-linear-to-r from-red-800 via-emergency-red to-red-900 text-white px-4 py-2 border-b border-red-950/30 shadow-xs relative overflow-hidden">
      {/* Subtle shine effect */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <span className="font-bold tracking-tight">
            {t.hero.emergencyBanner}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 font-medium">
          <a
            href="tel:16263"
            className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[11px] font-bold transition-all shadow-2xs"
          >
            <PhoneCall className="w-3 h-3" />
            <span>BD: 16263</span>
          </a>
          <a
            href="tel:999"
            className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[11px] font-bold transition-all shadow-2xs"
          >
            <PhoneCall className="w-3 h-3" />
            <span>BD: 999</span>
          </a>
          <a
            href="tel:108"
            className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[11px] font-bold transition-all shadow-2xs"
          >
            <PhoneCall className="w-3 h-3" />
            <span>IN: 108</span>
          </a>
          <a
            href="tel:1122"
            className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[11px] font-bold transition-all shadow-2xs"
          >
            <PhoneCall className="w-3 h-3" />
            <span>PK: 1122</span>
          </a>
        </div>
      </div>
    </div>
  );
}
