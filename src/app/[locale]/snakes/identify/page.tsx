'use client';

import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/i18n/LocaleContext';
import { ImageUploader } from '@/components/capture/ImageUploader';
import { VenomAlertBadge } from '@/components/snakes/VenomAlertBadge';
import { AntivenomCard } from '@/components/snakes/AntivenomCard';
import { FirstAidChecklist } from '@/components/snakes/FirstAidChecklist';
import { useIdentifySnakeMutation } from '@/store/api/snakeApi';
import type { IIdentificationResult } from '@/core/interfaces';

export default function SnakeIdentifyPage() {
  const { locale, t } = useTranslation();
  const [result, setResult] = useState<IIdentificationResult | null>(null);
  const [identifySnake, { isLoading }] = useIdentifySnakeMutation();

  const handleIdentify = async ({
    file,
    region,
  }: {
    file: File;
    region: string;
  }) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('region', region);
    const data = await identifySnake(formData).unwrap();
    setResult(data);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-venom-deadly/10 text-venom-deadly text-xs font-bold border border-venom-deadly/20">
          <ShieldAlert className="w-4 h-4" />
          <span>Life-Saving Snakebite Neural Identifier</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
          {t.nav.snakes}
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-text-secondary">
          Upload or capture a photo of the snake. Our neural network immediately
          diagnoses venomous status, recommends required polyvalent antivenom,
          and guides you through the Golden Hour medical protocol.
        </p>
      </div>

      {/* Upload Box */}
      <ImageUploader
        mode="snake"
        onIdentify={handleIdentify}
        isLoading={isLoading}
      />

      {/* Result Container */}
      {result && result.snakeData && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  Diagnosis Result
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">
                  {result.snakeData.commonName[locale] ||
                    result.snakeData.commonName.en}
                </h2>
                <p className="text-sm italic text-text-muted">
                  {result.snakeData.scientificName}
                </p>
              </div>
              <VenomAlertBadge
                dangerLevel={result.snakeData.venomProfile.dangerLevel}
              />
            </div>

            <AntivenomCard venomProfile={result.snakeData.venomProfile} />
            <FirstAidChecklist />
          </div>
        </div>
      )}
    </div>
  );
}
