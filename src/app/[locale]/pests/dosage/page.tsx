'use client';

import React, { useState } from 'react';
import { Calculator, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/i18n/LocaleContext';
import { DosageCalculator } from '@/components/pests/DosageCalculator';

const COMMON_AGROCHEMICALS = [
  {
    name: 'Imidacloprid 17.8% SL (Mango Hopper)',
    dose: 0.35,
    unit: 'ml' as const,
  },
  {
    name: 'Chlorantraniliprole 18.5% SC (Fruit Borer)',
    dose: 0.4,
    unit: 'ml' as const,
  },
  {
    name: 'Neem Seed Kernel Extract 5% (Bio-Insecticide)',
    dose: 4.0,
    unit: 'ml' as const,
  },
  {
    name: 'Cartap Hydrochloride 50% SP (Paddy Stem Borer)',
    dose: 1.5,
    unit: 'g' as const,
  },
  {
    name: 'Cypermethrin 10% EC (General Caterpillar)',
    dose: 1.0,
    unit: 'ml' as const,
  },
];

export default function StandaloneDosagePage() {
  const { t } = useTranslation();
  const [selectedChemical, setSelectedChemical] = useState(
    COMMON_AGROCHEMICALS[0],
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold border border-brand-primary/20">
          <Calculator className="w-4 h-4" />
          <span>Agricultural Dilution Utility</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
          {t.nav.dosage}
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-text-secondary">
          Prevent crop chemical burn and pesticide resistance. Calculate exact
          milliliters or grams of agrochemical required for 10L, 16L, or 20L
          knapsack sprayer tanks.
        </p>
      </div>

      {/* Quick Preset Selector */}
      <div className="p-6 rounded-3xl bg-bg-surface border border-border-subtle shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
          <span>Quick Preset Agrochemicals</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_AGROCHEMICALS.map(chem => (
            <button
              key={chem.name}
              type="button"
              onClick={() => setSelectedChemical(chem)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                selectedChemical.name === chem.name
                  ? 'bg-brand-primary text-brand-primary-foreground border-brand-primary shadow-2xs'
                  : 'bg-bg-subtle text-text-primary border-border-subtle hover:bg-border-subtle'
              }`}
            >
              {chem.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Calculator */}
      <DosageCalculator
        key={selectedChemical.name}
        pesticideName={selectedChemical.name}
        initialDosePerLiter={selectedChemical.dose}
        initialUnit={selectedChemical.unit}
      />

      {/* Best Practices for Spraying */}
      <div className="p-6 sm:p-8 rounded-3xl bg-bg-surface border border-border-subtle space-y-4 shadow-xs">
        <h3 className="text-lg font-bold text-text-primary">
          Golden Rules for Field Spraying Safety & Efficiency
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-text-secondary">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-bg-subtle border border-border-subtle">
            <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <span>
              <strong>Never Spray at Midday:</strong> High temperatures cause
              rapid chemical evaporation and leaf scorch. Spray between 6:00 AM
              – 9:00 AM or after 4:00 PM.
            </span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-bg-subtle border border-border-subtle">
            <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <span>
              <strong>Protect Honeybees:</strong> Avoid spraying blooming
              flowers during peak pollinator foraging hours.
            </span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-bg-subtle border border-border-subtle">
            <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <span>
              <strong>Use Clean Water:</strong> Muddy pond water deactivates
              systemic chemical molecules like glyphosate and imidacloprid. Use
              tube-well or clean canal water.
            </span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-bg-subtle border border-border-subtle">
            <ShieldAlert className="w-4 h-4 text-pest-critical shrink-0 mt-0.5" />
            <span>
              <strong>Respect Pre-Harvest Interval (PHI):</strong> Stop spraying
              at least 7 to 21 days before picking mangoes or harvesting
              vegetables.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
