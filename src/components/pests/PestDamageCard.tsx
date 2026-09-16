'use client';

import React from 'react';
import { AlertCircle, Sprout, TrendingDown, CheckSquare } from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';
import type { IPestDamageProfile } from '../../core/interfaces';

interface PestDamageCardProps {
  damageProfile: IPestDamageProfile;
}

export function PestDamageCard({ damageProfile }: PestDamageCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-sm tracking-wide">
            <Sprout className="w-4 h-4" />
            <span>Crop Damage Diagnosis</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
            {t.pest.symptomsTitle}
          </h3>
        </div>

        {/* Severity Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pest-critical/10 text-pest-critical text-xs font-bold w-fit">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>
            {damageProfile.severity === 'critical'
              ? t.pest.severityHigh
              : damageProfile.severity === 'moderate'
                ? t.pest.severityModerate
                : t.pest.severityLow}
          </span>
        </div>
      </div>

      {/* Affected Crops Tags */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          {t.pest.affectedCrops}
        </span>
        <div className="flex flex-wrap gap-2">
          {damageProfile.affectedCrops.map(crop => (
            <span
              key={crop}
              className="px-3 py-1 rounded-xl bg-bg-subtle text-text-primary text-xs font-semibold border border-border-subtle capitalize"
            >
              {crop}
            </span>
          ))}
        </div>
      </div>

      {/* Symptoms List */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Observed Symptoms & Field Signatures
        </span>
        <div className="space-y-2">
          {damageProfile.symptoms.map((symptom, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary"
            >
              <CheckSquare className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <span className="leading-relaxed">{symptom}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Yield Loss Estimate Box */}
      <div className="p-4 rounded-2xl bg-bg-subtle border border-border-subtle flex items-start gap-3">
        <TrendingDown className="w-5 h-5 text-pest-critical shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Economic Threshold & Yield Risk
          </h4>
          <p className="text-xs sm:text-sm text-text-secondary">
            Estimated Yield Reduction:{' '}
            <strong className="text-pest-critical">
              {damageProfile.yieldLossPotential}
            </strong>{' '}
            if untreated during critical vegetative or fruiting stages.
          </p>
        </div>
      </div>
    </div>
  );
}
