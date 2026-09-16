'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';
import type { DangerLevel } from '../../core/types';

interface VenomAlertBadgeProps {
  dangerLevel: DangerLevel;
  className?: string;
}

export function VenomAlertBadge({
  dangerLevel,
  className = '',
}: VenomAlertBadgeProps) {
  const { t } = useTranslation();

  if (dangerLevel === 'deadly') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-venom-deadly-subtle text-venom-deadly border border-venom-deadly-border font-bold text-xs sm:text-sm tracking-wide animate-pulse ${className}`}
      >
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>{t.snake.badgeVenomous}</span>
      </div>
    );
  }

  if (dangerLevel === 'mild') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-venom-mild-subtle text-venom-mild border border-venom-mild-border font-bold text-xs sm:text-sm tracking-wide ${className}`}
      >
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{t.snake.badgeMild}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-venom-safe-subtle text-venom-safe border border-venom-safe-border font-bold text-xs sm:text-sm tracking-wide ${className}`}
    >
      <ShieldCheck className="w-4 h-4 shrink-0" />
      <span>{t.snake.badgeSafe}</span>
    </div>
  );
}
