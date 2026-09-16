'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';
import { VenomAlertBadge } from '../snakes/VenomAlertBadge';
import { SpeciesModal } from './SpeciesModal';
import { MOCK_SNAKES } from '../../core/data/mockData';
import type { ISnake } from '../../core/interfaces';

export const CommonSnakesSection: React.FC = () => {
  const { locale, t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'venomous' | 'harmless' | 'mild'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnake, setSelectedSnake] = useState<ISnake | null>(null);

  const filteredSnakes = useMemo(() => {
    return MOCK_SNAKES.filter(snake => {
      // Filter tab
      if (filter === 'venomous' && snake.venomProfile.dangerLevel !== 'deadly')
        return false;
      if (filter === 'harmless' && snake.venomProfile.dangerLevel !== 'harmless')
        return false;
      if (filter === 'mild' && snake.venomProfile.dangerLevel !== 'mild')
        return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const common = (snake.commonName[locale] || snake.commonName.en).toLowerCase();
        const enName = snake.commonName.en.toLowerCase();
        const sciName = snake.scientificName.toLowerCase();
        return common.includes(q) || enName.includes(q) || sciName.includes(q);
      }

      return true;
    });
  }, [filter, searchQuery, locale]);

  const counts = useMemo(() => {
    return {
      all: MOCK_SNAKES.length,
      venomous: MOCK_SNAKES.filter(s => s.venomProfile.dangerLevel === 'deadly').length,
      harmless: MOCK_SNAKES.filter(s => s.venomProfile.dangerLevel === 'harmless').length,
      mild: MOCK_SNAKES.filter(s => s.venomProfile.dangerLevel === 'mild').length,
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-venom-deadly/10 text-venom-deadly text-xs font-bold border border-venom-deadly/20 shadow-2xs">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t.commonSnakes.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            {t.commonSnakes.title}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {t.commonSnakes.subtitle}
          </p>
        </div>

        {/* Link to Encyclopedia */}
        <Link
          href={`/${locale}/snakes/encyclopedia`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-bg-surface border border-border-subtle hover:border-brand-primary text-text-primary hover:text-brand-primary text-xs sm:text-sm font-bold shadow-2xs transition-all shrink-0"
        >
          <span>{t.commonSnakes.exploreAll}</span>
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
            {t.commonSnakes.filterAll} ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilter('venomous')}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'venomous'
                ? 'bg-venom-deadly text-venom-deadly-foreground shadow-xs'
                : 'text-text-muted hover:text-venom-deadly'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t.commonSnakes.filterVenomous} ({counts.venomous})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('harmless')}
            className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'harmless'
                ? 'bg-venom-safe text-venom-safe-foreground shadow-xs'
                : 'text-text-muted hover:text-venom-safe'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.commonSnakes.filterHarmless} ({counts.harmless})</span>
          </button>
          {counts.mild > 0 && (
            <button
              type="button"
              onClick={() => setFilter('mild')}
              className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'mild'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-text-muted hover:text-amber-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.commonSnakes.filterMild} ({counts.mild})</span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.commonSnakes.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-surface border border-border-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-2xs"
          />
        </div>
      </div>

      {/* Snake Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSnakes.map(snake => {
          const commonName = snake.commonName[locale] || snake.commonName.en;
          const isVenomous = snake.venomProfile.isVenomous;

          return (
            <div
              key={snake.id}
              className="group rounded-3xl border border-border-subtle bg-bg-surface overflow-hidden shadow-xs hover:border-border-strong hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badges */}
                <div className="relative aspect-16/10 bg-bg-subtle overflow-hidden">
                  <Image
                    src={snake.imageUrl}
                    alt={commonName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <VenomAlertBadge
                      dangerLevel={snake.venomProfile.dangerLevel}
                    />
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-[11px] font-semibold text-white">
                    {snake.family}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-text-primary group-hover:text-brand-primary transition-colors leading-snug">
                      {commonName}
                    </h3>
                    <p className="text-xs italic text-text-muted font-medium mt-0.5">
                      {snake.scientificName}
                    </p>
                  </div>

                  {/* Antivenom Requirement Pill */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      isVenomous
                        ? 'bg-venom-deadly-subtle text-venom-deadly border border-venom-deadly-border'
                        : 'bg-venom-safe-subtle text-venom-safe border border-venom-safe-border'
                    }`}
                  >
                    {isVenomous ? (
                      <ShieldAlert className="w-3.5 h-3.5" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isVenomous
                        ? t.commonSnakes.asvRequired
                        : t.commonSnakes.asvSafe}
                    </span>
                  </div>

                  {/* Habitat excerpt */}
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {snake.habitat}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedSnake(snake)}
                  className="w-full py-2.5 px-3 rounded-xl bg-bg-subtle hover:bg-border-subtle border border-border-subtle text-text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-colors group-hover:border-border-strong"
                >
                  <Info className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{t.commonSnakes.viewDetails}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSnakes.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-bg-surface border border-border-subtle space-y-2">
          <p className="text-sm font-bold text-text-primary">
            No matching snakes found
          </p>
          <p className="text-xs text-text-muted">
            Try adjusting your search query or filter category.
          </p>
        </div>
      )}

      {/* Modal Popup for Selected Snake */}
      {selectedSnake && (
        <SpeciesModal
          item={selectedSnake}
          type="snake"
          onClose={() => setSelectedSnake(null)}
        />
      )}
    </section>
  );
};

