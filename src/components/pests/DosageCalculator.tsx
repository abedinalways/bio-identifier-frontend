'use client';

import React, { useState } from 'react';
import { Calculator, Beaker, HelpCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';
import { calculateSprayerDosage } from '../../lib/formatters';

interface DosageCalculatorProps {
  initialDosePerLiter?: number;
  initialUnit?: 'ml' | 'g';
  pesticideName?: string;
}

const PRESET_TANKS = [5, 10, 16, 20];

export function DosageCalculator({
  initialDosePerLiter = 0.4,
  initialUnit = 'ml',
  pesticideName = 'Selected Treatment',
}: DosageCalculatorProps) {
  const { t } = useTranslation();
  const [tankSize, setTankSize] = useState<number>(16);
  const [dosePerLiter, setDosePerLiter] = useState<number>(initialDosePerLiter);
  const [unit, setUnit] = useState<'ml' | 'g'>(initialUnit);

  const result = calculateSprayerDosage({
    tankSizeLiters: tankSize,
    recommendedDosePerLiter: dosePerLiter,
    unit,
  });

  return (
    <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-sm tracking-wide">
            <Calculator className="w-4 h-4" />
            <span>{t.dosageCalc.title}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
            Knapsack Dilution Calculator
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
          {pesticideName}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Form: Tank Size & Dose Controls */}
        <div className="space-y-5">
          {/* Tank Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary">
              {t.dosageCalc.tankSizeLabel}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_TANKS.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTankSize(size)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    tankSize === size
                      ? 'bg-brand-primary text-brand-primary-foreground border-brand-primary shadow-xs'
                      : 'bg-bg-subtle text-text-primary border-border-subtle hover:bg-border-subtle'
                  }`}
                >
                  {size} L
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tank Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-text-muted">
              <span>Custom Capacity</span>
              <span className="font-bold text-text-primary">
                {tankSize} Liters
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={tankSize}
              onChange={e => setTankSize(Number(e.target.value))}
              className="w-full accent-brand-primary cursor-pointer"
            />
          </div>

          {/* Dose per Liter Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text-secondary">
                Dose per 1 Liter of Water
              </label>
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setUnit('ml')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
                    unit === 'ml'
                      ? 'bg-brand-primary text-brand-primary-foreground'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  ml (liquid)
                </button>
                <span className="text-border-strong">|</span>
                <button
                  type="button"
                  onClick={() => setUnit('g')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
                    unit === 'g'
                      ? 'bg-brand-primary text-brand-primary-foreground'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  g (powder)
                </button>
              </div>
            </div>
            <input
              type="number"
              step="0.05"
              min="0.01"
              value={dosePerLiter}
              onChange={e => setDosePerLiter(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-bg-surface text-text-primary font-semibold text-sm focus:outline-hidden focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Right Panel: Result & Mixing Guide */}
        <div className="rounded-2xl bg-brand-primary/5 border border-brand-primary/20 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-brand-primary">
              <Beaker className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {t.dosageCalc.calcResult}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-bg-surface border border-brand-primary/30 shadow-xs space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary">
                {result.totalQuantity}{' '}
                <span className="text-lg">{result.unit}</span>
              </div>
              <p className="text-xs text-text-muted">
                Mix into precisely {result.waterLiters} Liters of clean water
              </p>
            </div>
          </div>

          {/* Mixing Instructions */}
          <div className="space-y-2 pt-2 border-t border-brand-primary/15">
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
              <HelpCircle className="w-3.5 h-3.5 text-brand-primary" />
              <span>Safe Mixing Protocol:</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {t.dosageCalc.instructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
