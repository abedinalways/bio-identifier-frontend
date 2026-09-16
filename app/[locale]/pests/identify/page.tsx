'use client';

import React, { useState } from 'react';
import { Bug, Sprout } from 'lucide-react';
import { useTranslation } from '../../../../src/i18n/LocaleContext';
import { ImageUploader } from '../../../../src/components/capture/ImageUploader';
import { PestDamageCard } from '../../../../src/components/pests/PestDamageCard';
import { PesticideGuideCard } from '../../../../src/components/pests/PesticideGuideCard';
import { DosageCalculator } from '../../../../src/components/pests/DosageCalculator';
import { useIdentifyPestMutation } from '../../../../src/store/api/pestApi';
import type {
  IIdentificationResult,
  IPesticideRecommendation,
} from '../../../../src/core/interfaces';
import type { CropType } from '../../../../src/core/types';

export default function PestIdentifyPage() {
  const { locale, t } = useTranslation();
  const [result, setResult] = useState<IIdentificationResult | null>(null);
  const [selectedTreatment, setSelectedTreatment] =
    useState<IPesticideRecommendation | null>(null);
  const [identifyPest, { isLoading }] = useIdentifyPestMutation();

  const handleIdentify = async ({
    file,
    region,
    cropType,
  }: {
    file: File;
    region: string;
    cropType?: CropType;
  }) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('region', region);
    if (cropType) formData.append('cropType', cropType);
    const data = await identifyPest(formData).unwrap();
    setResult(data);
    if (data.pestData?.treatments?.[0]) {
      setSelectedTreatment(data.pestData.treatments[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold border border-brand-primary/20">
          <Bug className="w-4 h-4" />
          <span>Agricultural Neural Crop Protector</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
          {t.nav.pests}
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-text-secondary">
          Diagnose destructive insect pests on mango, litchi, paddy, and
          vegetables. Receive immediate biological or chemical treatment
          recommendations, dilution rates, and harvest safety intervals.
        </p>
      </div>

      {/* Upload Box */}
      <ImageUploader
        mode="pest"
        onIdentify={handleIdentify}
        isLoading={isLoading}
      />

      {/* Result Container */}
      {result && result.pestData && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  Diagnosis Result
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">
                  {result.pestData.commonName[locale] ||
                    result.pestData.commonName.en}
                </h2>
                <p className="text-sm italic text-text-muted">
                  {result.pestData.scientificName}
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pest-critical/10 text-pest-critical text-xs font-bold w-fit">
                <Sprout className="w-3.5 h-3.5" />
                <span>Agricultural Specimen Confirmed</span>
              </div>
            </div>

            <PestDamageCard damageProfile={result.pestData.damageProfile} />

            <PesticideGuideCard
              treatments={result.pestData.treatments}
              onSelectTreatmentForCalculator={treatment =>
                setSelectedTreatment(treatment)
              }
            />

            <DosageCalculator
              pesticideName={
                selectedTreatment?.title || result.pestData.treatments[0]?.title
              }
              initialDosePerLiter={selectedTreatment?.dosagePerLiter || 0.4}
              initialUnit={selectedTreatment?.dosageUnit || 'ml'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
