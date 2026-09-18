'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BookOpen, Leaf } from 'lucide-react';
import { useTranslation } from '@/i18n/LocaleContext';
import { MOCK_PESTS } from '@/core/data/mockData';
import { useGetPestsListQuery } from '@/store/api/pestApi';
import type { CropType } from '@/core/types';

export default function PestEncyclopediaPage() {
  const { locale } = useTranslation();
  const { data: pests = MOCK_PESTS } = useGetPestsListQuery();
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  const filteredPests = pests.filter(pest => {
    if (selectedCrop === 'all') return true;
    return pest.damageProfile?.affectedCrops?.includes(
      selectedCrop as CropType,
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold border border-brand-primary/20">
          <BookOpen className="w-4 h-4" />
          <span>Crop Protection Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
          Agricultural Pest Encyclopedia
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-text-secondary">
          Identify destructive insects attacking commercial orchards (mango,
          litchi) and field crops (paddy rice, vegetables). Review biology,
          damage signatures, and organic bio-controls.
        </p>
      </div>

      {/* Crop Filter Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap justify-center p-1 rounded-2xl bg-bg-surface border border-border-subtle shadow-2xs gap-1">
          {['all', 'mango', 'litchi', 'rice'].map(crop => (
            <button
              key={crop}
              type="button"
              onClick={() => setSelectedCrop(crop)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors capitalize ${
                selectedCrop === crop
                  ? 'bg-brand-primary text-brand-primary-foreground shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {crop === 'all' ? 'All Host Crops' : crop}
            </button>
          ))}
        </div>
      </div>

      {/* Pests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPests.map(pest => (
          <div
            key={pest.id}
            className="rounded-3xl border border-border-subtle bg-bg-surface overflow-hidden shadow-xs hover:border-border-strong transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="relative aspect-16/10 bg-bg-subtle">
                <Image
                  src={pest.imageUrl}
                  alt={pest.commonName.en}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-pest-critical/90 text-pest-critical-foreground text-xs font-bold shadow-xs">
                  {pest.damageProfile.severity === 'critical'
                    ? 'High Threat'
                    : 'Moderate'}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    {pest.commonName[locale] || pest.commonName.en}
                  </h3>
                  <p className="text-xs italic text-text-muted">
                    {pest.scientificName}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {pest.damageProfile.affectedCrops.map(c => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-md bg-bg-subtle text-xs font-semibold text-brand-primary border border-border-subtle capitalize"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                    Key Damage Symptoms:
                  </span>
                  <ul className="space-y-1 text-xs text-text-secondary">
                    {pest.damageProfile.symptoms.slice(0, 2).map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-pest-critical shrink-0 mt-0.5">
                          •
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 pt-0 space-y-2">
              <div className="p-3 rounded-xl bg-pest-organic-subtle/80 border border-pest-organic-border text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-pest-organic font-bold">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Bio / Organic Defense:</span>
                </div>
                <p className="text-text-secondary font-medium">
                  {pest.treatments.find(t => t.type === 'organic')?.title ||
                    'Neem Extract 5%'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
