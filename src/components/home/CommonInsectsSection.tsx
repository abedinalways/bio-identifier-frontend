'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bug,
  AlertTriangle,
  Leaf,
  Search,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';
import { SpeciesModal } from './SpeciesModal';
import { MOCK_PESTS } from '../../core/data/mockData';
import type { IPest } from '../../core/interfaces';

export const CommonInsectsSection: React.FC = () => {
  const { locale, t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'crop' | 'stinging'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPest, setSelectedPest] = useState<IPest | null>(null);

  const filteredPests = useMemo(() => {
    return MOCK_PESTS.filter(pest => {
      // Filter tab
      if (filter === 'crop' && pest.category !== 'crop_pest') return false;
      if (filter === 'stinging' && pest.category !== 'stinging_insect')
        return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const common = (
          pest.commonName[locale] || pest.commonName.en
        ).toLowerCase();
        const enName = pest.commonName.en.toLowerCase();
        const sciName = pest.scientificName.toLowerCase();
        const crops = pest.damageProfile.affectedCrops.join(' ').toLowerCase();
        return (
          common.includes(q) ||
          enName.includes(q) ||
          sciName.includes(q) ||
          crops.includes(q)
        );
      }

      return true;
    });
  }, [filter, searchQuery, locale]);

  const counts = useMemo(() => {
    return {
      all: MOCK_PESTS.length,
      crop: MOCK_PESTS.filter(p => p.category === 'crop_pest').length,
      stinging: MOCK_PESTS.filter(p => p.category === 'stinging_insect').length,
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold border border-brand-primary/20 shadow-2xs">
            <Bug className="w-3.5 h-3.5" />
            <span>{t.commonInsects.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            {t.commonInsects.title}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {t.commonInsects.subtitle}
          </p>
        </div>

        {/* Link to Encyclopedia */}
        <Link
          href={`/${locale}/pests/encyclopedia`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-bg-surface border border-border-subtle hover:border-brand-primary text-text-primary hover:text-brand-primary text-xs sm:text-sm font-bold shadow-2xs transition-all shrink-0"
        >
          <span>{t.commonInsects.exploreAll}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Control Bar: Filter Tabs + Search Input */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-bg-subtle border border-border-subtle w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-bg-surface text-text-primary shadow-xs border border-border-subtle'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {t.commonInsects.filterAll} ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilter('crop')}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'crop'
                ? 'bg-brand-primary text-brand-primary-foreground shadow-xs'
                : 'text-text-muted hover:text-brand-primary'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>
              {t.commonInsects.filterCrop} ({counts.crop})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('stinging')}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'stinging'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-text-muted hover:text-amber-600'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>
              {t.commonInsects.filterStinging} ({counts.stinging})
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.commonInsects.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-surface border border-border-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-2xs"
          />
        </div>
      </div>

      {/* Insects Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPests.map(pest => {
          const commonName = pest.commonName[locale] || pest.commonName.en;
          const isStinging = pest.category === 'stinging_insect';

          return (
            <div
              key={pest.id}
              className="card-hover group rounded-3xl border border-border-subtle bg-bg-surface overflow-hidden shadow-xs hover:border-brand-primary/40 hover:shadow-lg transition-all flex flex-col justify-between ring-1 ring-border-subtle/50"
            >
              <div>
                {/* Photo & Badges */}
                <div className="relative aspect-16/10 bg-bg-subtle overflow-hidden">
                  <Image
                    src={pest.imageUrl}
                    alt={commonName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                        isStinging
                          ? 'bg-amber-600 text-white'
                          : 'bg-pest-critical text-white'
                      }`}
                    >
                      {isStinging ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Stinging Risk</span>
                        </>
                      ) : (
                        <>
                          <Leaf className="w-3.5 h-3.5" />
                          <span>Crop Destroyer</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 shadow-sm capitalize">
                    {pest.damageProfile.severity === 'critical'
                      ? 'Critical Impact'
                      : 'Moderate Impact'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-extrabold text-text-primary group-hover:text-brand-primary transition-colors leading-snug">
                      {commonName}
                    </h3>
                    <p className="text-xs italic text-text-muted font-medium mt-0.5">
                      {pest.scientificName}
                    </p>
                  </div>

                  {/* Host Crops or Type Pills */}
                  <div className="flex flex-wrap gap-1">
                    {pest.damageProfile.affectedCrops.map(crop => (
                      <span
                        key={crop}
                        className="px-2.5 py-0.5 rounded-md bg-brand-primary/5 text-xs font-bold text-brand-primary border border-brand-primary/20 capitalize"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>

                  {/* Primary symptom excerpt */}
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {pest.damageProfile.symptoms[0]}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedPest(pest)}
                  className="w-full py-2.5 px-3 rounded-xl bg-bg-subtle hover:bg-brand-primary hover:text-white border border-border-subtle hover:border-brand-primary text-text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs group/btn"
                >
                  <Info className="w-3.5 h-3.5 text-brand-primary group-hover/btn:text-white transition-colors" />
                  <span>{t.commonInsects.viewRemedy}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPests.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-bg-surface border border-border-subtle space-y-2">
          <p className="text-sm font-bold text-text-primary">
            No matching insects found
          </p>
          <p className="text-xs text-text-muted">
            Try adjusting your search query or filter category.
          </p>
        </div>
      )}

      {/* Modal Popup for Selected Pest */}
      {selectedPest && (
        <SpeciesModal
          item={selectedPest}
          type="pest"
          onClose={() => setSelectedPest(null)}
        />
      )}
    </section>
  );
};
