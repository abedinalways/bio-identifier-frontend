'use client';

import React from 'react';
import {
  Leaf,
  FlaskConical,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';
import type { IPesticideRecommendation } from '../../core/interfaces';

interface PesticideGuideCardProps {
  treatments: IPesticideRecommendation[];
  onSelectTreatmentForCalculator?: (
    treatment: IPesticideRecommendation,
  ) => void;
}

export function PesticideGuideCard({
  treatments,
  onSelectTreatmentForCalculator,
}: PesticideGuideCardProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
          Recommended Pest Management Protocols
        </h3>
        <p className="text-xs sm:text-sm text-text-muted">
          Compare organic biological remedies and targeted chemical treatments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {treatments.map(treatment => {
          const isOrganic = treatment.type === 'organic';
          return (
            <div
              key={treatment.id}
              className={`rounded-3xl border p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all shadow-xs ${
                isOrganic
                  ? 'bg-pest-organic-subtle/60 border-pest-organic-border'
                  : 'bg-pest-chemical-subtle/60 border-pest-chemical-border'
              }`}
            >
              {/* Header & Badges */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isOrganic ? (
                      <div className="w-8 h-8 rounded-xl bg-pest-organic text-pest-organic-foreground flex items-center justify-center">
                        <Leaf className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-pest-chemical text-pest-chemical-foreground flex items-center justify-center">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                    )}
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isOrganic ? 'text-pest-organic' : 'text-pest-chemical'
                      }`}
                    >
                      {isOrganic ? t.pest.organicTitle : t.pest.chemicalTitle}
                    </span>
                  </div>

                  {/* Pre-Harvest Interval (PHI) Badge */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pest-phi-badge text-pest-phi-foreground text-xs font-bold">
                    <Clock className="w-3 h-3" />
                    <span>PHI: {treatment.preHarvestIntervalDays} Days</span>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-text-primary leading-snug">
                  {treatment.title}
                </h4>

                {/* Active Ingredient */}
                <div className="p-3 rounded-xl bg-bg-surface border border-border-subtle space-y-1">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {t.pest.activeIngredient}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-text-primary">
                    {treatment.activeIngredient}
                  </p>
                </div>
              </div>

              {/* Dilution & Dosage Details */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-bg-surface border border-border-subtle flex items-center justify-between">
                  <span className="text-xs font-medium text-text-secondary">
                    {t.pest.dosagePerLiter}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-text-primary">
                    {treatment.dosagePerLiter} {treatment.dosageUnit} / L
                  </span>
                </div>

                {/* Commercial Brand Names */}
                {treatment.commercialExamples.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-text-muted">
                      Regional Commercial Names:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {treatment.commercialExamples.map(brand => (
                        <span
                          key={brand}
                          className="px-2 py-0.5 rounded-md bg-bg-surface text-xs font-medium text-text-secondary border border-border-subtle"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timing & Bee Safety */}
                <div className="p-3 rounded-xl bg-bg-surface/80 border border-border-subtle space-y-1 text-xs text-text-secondary">
                  <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                    <Clock className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{treatment.optimalTiming}</span>
                  </div>
                  <p className="text-text-muted">{t.pest.timingTip}</p>
                </div>

                {/* Safety & Gear */}
                <div className="flex items-start gap-2 text-xs text-text-muted">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-brand-primary mt-0.5" />
                  <span>{treatment.safetyInstructions}</span>
                </div>
              </div>

              {/* Button to populate dosage calculator */}
              {onSelectTreatmentForCalculator && (
                <button
                  type="button"
                  onClick={() => onSelectTreatmentForCalculator(treatment)}
                  className="w-full py-2.5 px-4 rounded-xl border border-border-strong bg-bg-surface text-text-primary font-semibold text-xs sm:text-sm hover:bg-bg-subtle transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Calculate Sprayer Tank Dose</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-pest-phi-subtle border border-pest-phi-badge/20 flex items-start gap-3 text-xs sm:text-sm text-text-primary">
        <AlertTriangle className="w-5 h-5 text-pest-phi-badge shrink-0 mt-0.5" />
        <p className="leading-relaxed">{t.pest.safetyGear}</p>
      </div>
    </div>
  );
}
