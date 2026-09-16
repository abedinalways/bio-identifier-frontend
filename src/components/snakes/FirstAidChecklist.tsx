'use client';

import React from 'react';
import { CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';

export function FirstAidChecklist() {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Title */}
      <div className="flex items-center gap-2 text-text-primary">
        <ShieldAlert className="w-5 h-5 text-brand-primary" />
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
          {t.snake.firstAidTitle}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DOs Panel (Green) */}
        <div className="rounded-2xl border border-venom-safe-border bg-venom-safe-subtle p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-venom-safe font-bold text-sm tracking-wide">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{t.snake.firstAidDosTitle}</span>
          </div>
          <ul className="space-y-3">
            {t.snake.firstAidDos.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-text-primary"
              >
                <span className="w-5 h-5 rounded-full bg-venom-safe text-venom-safe-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DON'Ts Panel (Red) */}
        <div className="rounded-2xl border border-venom-deadly-border bg-venom-deadly-subtle p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-venom-deadly font-bold text-sm tracking-wide">
            <XCircle className="w-5 h-5 shrink-0" />
            <span>{t.snake.firstAidDontsTitle}</span>
          </div>
          <ul className="space-y-3">
            {t.snake.firstAidDonts.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-text-primary"
              >
                <span className="w-5 h-5 rounded-full bg-venom-deadly text-venom-deadly-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  ✕
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
