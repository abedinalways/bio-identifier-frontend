'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Leaf,
  Sparkles,
  Info,
  Beaker,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';
import { VenomAlertBadge } from '../snakes/VenomAlertBadge';
import type { ISnake, IPest } from '../../core/interfaces';

interface SpeciesModalProps {
  item: ISnake | IPest | null;
  type: 'snake' | 'pest';
  onClose: () => void;
}

export const SpeciesModal: React.FC<SpeciesModalProps> = ({
  item,
  type,
  onClose,
}) => {
  const { locale, t } = useTranslation();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const isSnake = type === 'snake';
  const snake = isSnake ? (item as ISnake) : null;
  const pest = !isSnake ? (item as IPest) : null;

  const title = item.commonName[locale] || item.commonName.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-bg-surface border border-border-subtle shadow-2xl p-6 sm:p-8 space-y-6 text-text-primary"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-bg-subtle text-text-muted hover:text-text-primary hover:bg-border-subtle transition-colors focus:outline-none"
          aria-label={t.speciesModal.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            {snake && (
              <VenomAlertBadge dangerLevel={snake.venomProfile.dangerLevel} />
            )}
            {pest && (
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  pest.category === 'stinging_insect'
                    ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    : 'bg-pest-critical/10 text-pest-critical border border-pest-critical/20'
                }`}
              >
                {pest.category === 'stinging_insect' ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Stinging / Biting Specimen</span>
                  </>
                ) : (
                  <>
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Agricultural Pest</span>
                  </>
                )}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {title}
          </h2>
          <p className="text-sm italic text-text-muted font-medium">
            {item.scientificName}
            {snake?.family ? ` • Family: ${snake.family}` : ''}
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-bg-subtle border border-border-subtle">
          <Image
            src={item.imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* SNAKE CONTENT */}
        {snake && (
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Antivenom & Toxicity Status */}
            <div
              className={`p-4 rounded-2xl border ${
                snake.venomProfile.isVenomous
                  ? 'bg-venom-deadly-subtle/70 border-venom-deadly-border text-venom-deadly'
                  : 'bg-venom-safe-subtle/70 border-venom-safe-border text-venom-safe'
              } space-y-1.5`}
            >
              <div className="flex items-center gap-2 font-bold">
                {snake.venomProfile.isVenomous ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>
                  {snake.venomProfile.isVenomous
                    ? t.commonSnakes.asvRequired
                    : t.commonSnakes.asvSafe}
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">
                {snake.venomProfile.lethalityRisk}
              </p>
            </div>

            {/* Habitat & Distribution */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-text-primary uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Info className="w-4 h-4 text-brand-primary" />
                <span>{t.speciesModal.habitat}</span>
              </h4>
              <p className="text-text-secondary leading-relaxed bg-bg-subtle p-3.5 rounded-xl border border-border-subtle">
                {snake.habitat}
              </p>
            </div>

            {/* First Aid Protocol */}
            <div className="space-y-2">
              <h4 className="font-bold text-text-primary uppercase tracking-wider text-xs flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-venom-deadly" />
                <span>{t.speciesModal.firstAid}</span>
              </h4>
              <ul className="space-y-1.5 bg-bg-subtle p-3.5 rounded-xl border border-border-subtle">
                {snake.firstAidSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-text-secondary text-xs sm:text-sm"
                  >
                    <span className="font-bold text-venom-deadly shrink-0">
                      ✓
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ecological Value */}
            <div className="p-3.5 rounded-xl bg-brand-primary/5 border border-brand-primary/20 space-y-1">
              <span className="font-bold text-brand-primary flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5" />
                <span>{t.speciesModal.ecologicalRole}</span>
              </span>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                {snake.ecologicalImportance}
              </p>
            </div>

            {/* Debunked Myths */}
            {snake.mythsDebunked && snake.mythsDebunked.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="font-bold text-text-primary uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{t.speciesModal.mythsDebunked}</span>
                </h4>
                <div className="space-y-1 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-800/40">
                  {snake.mythsDebunked.map((myth, idx) => (
                    <p key={idx} className="text-xs text-text-secondary">
                      💡 {myth}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PEST CONTENT */}
        {pest && (
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Sting Remedy if applicable */}
            {pest.stingRemedy && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                  <HeartPulse className="w-4 h-4 text-amber-600" />
                  <span>{t.commonInsects.stingCare}</span>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {pest.stingRemedy}
                </p>
              </div>
            )}

            {/* Affected Crops */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-text-primary uppercase tracking-wider text-xs">
                {t.commonInsects.targetCrops}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {pest.damageProfile.affectedCrops.map(crop => (
                  <span
                    key={crop}
                    className="px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary font-bold text-xs uppercase tracking-wider"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-text-primary uppercase tracking-wider text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-pest-critical" />
                <span>Damage Symptoms & Mechanism</span>
              </h4>
              <ul className="space-y-1.5 bg-bg-subtle p-3.5 rounded-xl border border-border-subtle">
                {pest.damageProfile.symptoms.map((symptom, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-text-secondary text-xs sm:text-sm"
                  >
                    <span className="text-pest-critical font-bold shrink-0">
                      •
                    </span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatment recommendations */}
            <div className="space-y-2">
              <h4 className="font-bold text-text-primary uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Beaker className="w-4 h-4 text-brand-primary" />
                <span>{t.speciesModal.treatments}</span>
              </h4>
              <div className="space-y-2.5">
                {pest.treatments.map(trt => (
                  <div
                    key={trt.id}
                    className={`p-3.5 rounded-xl border ${
                      trt.type === 'organic'
                        ? 'bg-pest-organic-subtle/80 border-pest-organic-border'
                        : 'bg-pest-chemical-subtle/80 border-pest-chemical-border'
                    } space-y-1`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          trt.type === 'organic'
                            ? 'text-pest-organic'
                            : 'text-pest-chemical'
                        }`}
                      >
                        {trt.type === 'organic'
                          ? '🌱 Biological / Organic Solution'
                          : '🧪 Chemical Spray Solution'}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-bg-surface border border-border-subtle text-text-muted">
                        Dose: {trt.dosagePerLiter} {trt.dosageUnit}/L
                      </span>
                    </div>
                    <p className="font-bold text-text-primary text-xs sm:text-sm">
                      {trt.title}
                    </p>
                    <p className="text-xs text-text-secondary">
                      <strong>Timing:</strong> {trt.optimalTiming}
                    </p>
                    {trt.preHarvestIntervalDays > 0 && (
                      <p className="text-xs text-pest-phi-badge font-semibold">
                        ⏳ Pre-Harvest Interval (PHI):{' '}
                        {trt.preHarvestIntervalDays} days before harvest
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-2 border-t border-border-subtle flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-bg-subtle hover:bg-border-subtle text-text-primary font-bold text-xs sm:text-sm transition-colors"
          >
            {t.speciesModal.close}
          </button>
        </div>
      </div>
    </div>
  );
};

