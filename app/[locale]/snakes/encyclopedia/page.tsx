'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BookOpen, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../../../src/i18n/LocaleContext';
import { VenomAlertBadge } from '../../../../src/components/snakes/VenomAlertBadge';
import { MOCK_SNAKES } from '../../../../src/core/data/mockData';

export default function SnakeEncyclopediaPage() {
  const { locale } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'venomous' | 'harmless'>('all');

  const filteredSnakes = MOCK_SNAKES.filter(snake => {
    if (filter === 'venomous') return snake.venomProfile.isVenomous;
    if (filter === 'harmless') return !snake.venomProfile.isVenomous;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold border border-brand-primary/20">
          <BookOpen className="w-4 h-4" />
          <span>Biological Reference Library</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
          South Asian Snake Encyclopedia
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-text-secondary">
          Explore native snakes of Bangladesh, India, and Pakistan. Learn to
          distinguish deadly venomous vipers and cobras from harmless rat snakes
          that protect agricultural grain storage.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-bg-surface border border-border-subtle shadow-2xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              filter === 'all'
                ? 'bg-brand-primary text-brand-primary-foreground shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All Species ({MOCK_SNAKES.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('venomous')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              filter === 'venomous'
                ? 'bg-venom-deadly text-venom-deadly-foreground shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Deadly Venomous</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('harmless')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              filter === 'harmless'
                ? 'bg-venom-safe text-venom-safe-foreground shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Harmless / Beneficial</span>
          </button>
        </div>
      </div>

      {/* Snakes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSnakes.map(snake => (
          <div
            key={snake.id}
            className="rounded-3xl border border-border-subtle bg-bg-surface overflow-hidden shadow-xs hover:border-border-strong transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="relative aspect-16/10 bg-bg-subtle">
                <Image
                  src={snake.imageUrl}
                  alt={snake.commonName.en}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <VenomAlertBadge
                    dangerLevel={snake.venomProfile.dangerLevel}
                  />
                </div>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    {snake.commonName[locale] || snake.commonName.en}
                  </h3>
                  <p className="text-xs italic text-text-muted">
                    {snake.scientificName}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-text-secondary">
                  <p>
                    <strong>Habitat:</strong> {snake.habitat}
                  </p>
                  <p>
                    <strong>Antivenom:</strong>{' '}
                    {snake.venomProfile.antivenomRequired
                      ? snake.venomProfile.antivenomType
                      : 'None required (Harmless)'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-bg-subtle text-xs text-text-secondary border border-border-subtle">
                  <strong className="text-brand-primary block mb-0.5">
                    Ecological Value:
                  </strong>
                  <span>{snake.ecologicalImportance}</span>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 pt-0">
              <span className="text-xs font-semibold text-text-muted">
                Family: {snake.family}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
