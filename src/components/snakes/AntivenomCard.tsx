'use client';

import React from 'react';
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';
import type { IVenomProfile } from '../../core/interfaces';

interface AntivenomCardProps {
  venomProfile: IVenomProfile;
}

export function AntivenomCard({ venomProfile }: AntivenomCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-antivenom-border bg-antivenom-subtle/50 p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-antivenom-tag font-bold text-sm tracking-wide">
            <Activity className="w-4 h-4" />
            <span>{t.nav.antivenom}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
            {venomProfile.antivenomRequired
              ? t.snake.antivenomRequired
              : t.snake.antivenomNotRequired}
          </h3>
        </div>

        {venomProfile.antivenomRequired ? (
          <span className="px-3 py-1 rounded-full bg-venom-deadly text-venom-deadly-foreground text-xs font-bold shrink-0">
            ASV Indicated
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-venom-safe text-venom-safe-foreground text-xs font-bold shrink-0">
            Not Required
          </span>
        )}
      </div>

      {venomProfile.antivenomRequired ? (
        <>
          {/* Antivenom Specification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle space-y-1.5">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t.snake.antivenomType}
              </span>
              <p className="text-sm sm:text-base font-bold text-text-primary">
                {venomProfile.antivenomType}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle space-y-1.5">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t.snake.commercialBrands}
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {venomProfile.commercialBrands.map(brand => (
                  <span
                    key={brand}
                    className="px-2.5 py-1 rounded-lg bg-bg-subtle text-xs font-medium text-text-secondary border border-border-subtle"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Venom Mechanism & Target Toxins */}
          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle space-y-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Venom Profile & Action Mechanism
            </span>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {venomProfile.lethalityRisk}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {venomProfile.targetToxins.map(toxin => (
                <span
                  key={toxin}
                  className="px-2 py-0.5 rounded-md bg-venom-deadly-subtle text-venom-deadly text-xs font-medium border border-venom-deadly-border"
                >
                  {toxin}
                </span>
              ))}
            </div>
          </div>

          {/* Critical Doctor Warning Alert */}
          <div className="p-4 sm:p-5 rounded-2xl bg-venom-deadly text-venom-deadly-foreground flex items-start gap-3 shadow-sm">
            <AlertOctagon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
              {t.snake.warningDoctor}
            </p>
          </div>
        </>
      ) : (
        <div className="p-6 rounded-2xl bg-bg-surface border border-border-subtle flex items-start gap-4">
          <CheckCircle2 className="w-8 h-8 text-venom-safe shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="text-base font-bold text-text-primary">
              No Antivenom Necessary
            </h4>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              This species possesses no medical threat to humans. Simple wound
              washing with soap and water and a standard tetanus toxoid
              injection (if overdue) are the only treatments required.
            </p>
            <p className="text-xs text-text-muted italic">
              {t.snake.ecologicalNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
