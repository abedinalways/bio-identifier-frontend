'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Bug,
  Activity,
  HeartPulse,
  Leaf,
  PhoneCall,
  Sparkles,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import { useTranslation } from '../../src/i18n/LocaleContext';
import { ImageUploader } from '../../src/components/capture/ImageUploader';
import { VenomAlertBadge } from '../../src/components/snakes/VenomAlertBadge';
import { AntivenomCard } from '../../src/components/snakes/AntivenomCard';
import { FirstAidChecklist } from '../../src/components/snakes/FirstAidChecklist';
import { PestDamageCard } from '../../src/components/pests/PestDamageCard';
import { PesticideGuideCard } from '../../src/components/pests/PesticideGuideCard';
import { DosageCalculator } from '../../src/components/pests/DosageCalculator';
import { HowToFirstAidSchema } from '../../src/components/seo/StructuredData';
import { HospitalLocatorSection } from '../../src/components/home/HospitalLocatorSection';
import { CommonSnakesSection } from '../../src/components/home/CommonSnakesSection';
import { CommonInsectsSection } from '../../src/components/home/CommonInsectsSection';
import { useIdentifySnakeMutation } from '../../src/store/api/snakeApi';
import { useIdentifyPestMutation } from '../../src/store/api/pestApi';
import type {
  IIdentificationResult,
  IPesticideRecommendation,
} from '../../src/core/interfaces';
import type { CropType } from '../../src/core/types';

export default function LocalizedHomePage() {
  const { locale, t } = useTranslation();
  const [activePortal, setActivePortal] = useState<'snake' | 'pest'>('snake');
  const [identificationResult, setIdentificationResult] =
    useState<IIdentificationResult | null>(null);
  const [selectedPesticide, setSelectedPesticide] =
    useState<IPesticideRecommendation | null>(null);

  const [identifySnake, { isLoading: isSnakeLoading }] =
    useIdentifySnakeMutation();
  const [identifyPest, { isLoading: isPestLoading }] =
    useIdentifyPestMutation();

  const handleIdentification = async ({
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

    if (activePortal === 'snake') {
      const result = await identifySnake(formData).unwrap();
      setIdentificationResult(result);
    } else {
      if (cropType) formData.append('cropType', cropType);
      const result = await identifyPest(formData).unwrap();
      setIdentificationResult(result);
      if (result.pestData?.treatments?.[0]) {
        setSelectedPesticide(result.pestData.treatments[0]);
      }
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* JSON-LD Schema for Emergency SEO */}
      <HowToFirstAidSchema />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-12 bg-linear-to-b from-bg-surface via-bg-surface/90 to-bg-app border-b border-border-subtle">
        {/* Ambient Glow Background Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-linear-to-b from-brand-primary/10 via-brand-accent/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative">
          {/* Bio-Safety Badge with Live Ping */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-bg-surface/90 backdrop-blur-md border border-border-subtle shadow-xs text-xs font-semibold text-text-primary">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary" />
            </span>
            <span>{t.app.badge}</span>
            <span className="text-text-muted">•</span>
            <span className="text-brand-primary font-bold">
              Neural Vision AI
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.15]">
            {t.hero.headline}
          </h1>

          {/* Subheadline */}
          <p className="max-w-3xl mx-auto text-sm sm:text-lg text-text-secondary leading-relaxed font-normal">
            {t.hero.subheadline}
          </p>

          {/* Dual Portal Switcher Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-bg-subtle border border-border-subtle shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActivePortal('snake');
                setIdentificationResult(null);
              }}
              className={`flex items-center gap-2.5 px-6 sm:px-9 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
                activePortal === 'snake'
                  ? 'bg-bg-surface text-venom-deadly border border-venom-deadly/30 shadow-xs glow-emergency'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-venom-deadly" />
              <span>{t.hero.snakeCardTitle}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActivePortal('pest');
                setIdentificationResult(null);
              }}
              className={`flex items-center gap-2.5 px-6 sm:px-9 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
                activePortal === 'pest'
                  ? 'bg-bg-surface text-brand-primary border border-brand-primary/30 shadow-xs glow-brand'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Bug className="w-4 h-4 text-brand-primary" />
              <span>{t.hero.pestCardTitle}</span>
            </button>
          </div>
        </div>

        {/* Trust Metrics Bar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-bg-surface/80 border border-border-subtle shadow-2xs backdrop-blur-xs text-xs">
            <div className="flex items-center gap-2.5 px-3 py-1.5">
              <div className="w-8 h-8 rounded-xl bg-venom-deadly/10 text-venom-deadly flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-bold text-text-primary block leading-tight">
                  Zero Delay
                </span>
                <span className="text-[11px] text-text-muted">
                  Golden Hour Protocol
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5">
              <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-bold text-text-primary block leading-tight">
                  100% Verified
                </span>
                <span className="text-[11px] text-text-muted">
                  Regional ASV Depots
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5">
              <div className="w-8 h-8 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-bold text-text-primary block leading-tight">
                  Accurate Dose
                </span>
                <span className="text-[11px] text-text-muted">
                  Knapsack Sprayers
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-bold text-text-primary block leading-tight">
                  Neural Vision
                </span>
                <span className="text-[11px] text-text-muted">
                  Species ID AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Identification Upload Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <ImageUploader
          mode={activePortal}
          onIdentify={handleIdentification}
          isLoading={isSnakeLoading || isPestLoading}
        />
      </section>

      {/* Identification Result Container */}
      {identificationResult && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 animate-in fade-in duration-500">
          <div className="p-6 sm:p-8 rounded-3xl bg-bg-surface border border-border-subtle shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  AI Neural Vision Diagnosis Complete
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-1">
                  {activePortal === 'snake' && identificationResult.snakeData
                    ? identificationResult.snakeData.commonName[locale] ||
                      identificationResult.snakeData.commonName.en
                    : identificationResult.pestData
                      ? identificationResult.pestData.commonName[locale] ||
                        identificationResult.pestData.commonName.en
                      : 'Biological Specimen'}
                </h2>
                <p className="text-sm italic text-text-muted">
                  {identificationResult.snakeData?.scientificName ||
                    identificationResult.pestData?.scientificName}
                </p>
              </div>

              {activePortal === 'snake' && identificationResult.snakeData && (
                <VenomAlertBadge
                  dangerLevel={
                    identificationResult.snakeData.venomProfile.dangerLevel
                  }
                />
              )}

              {activePortal === 'pest' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pest-critical/10 text-pest-critical text-xs font-bold w-fit">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Targeted Pest Diagnosed</span>
                </div>
              )}
            </div>

            {/* Snake Diagnosis Details */}
            {activePortal === 'snake' && identificationResult.snakeData && (
              <div className="space-y-8">
                <AntivenomCard
                  venomProfile={identificationResult.snakeData.venomProfile}
                />
                <FirstAidChecklist />
              </div>
            )}

            {/* Pest Diagnosis Details */}
            {activePortal === 'pest' && identificationResult.pestData && (
              <div className="space-y-8">
                <PestDamageCard
                  damageProfile={identificationResult.pestData.damageProfile}
                />
                <PesticideGuideCard
                  treatments={identificationResult.pestData.treatments}
                  onSelectTreatmentForCalculator={t => setSelectedPesticide(t)}
                />
                <DosageCalculator
                  pesticideName={
                    selectedPesticide?.title ||
                    identificationResult.pestData.treatments[0]?.title
                  }
                  initialDosePerLiter={selectedPesticide?.dosagePerLiter || 0.4}
                  initialUnit={selectedPesticide?.dosageUnit || 'ml'}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Emergency Nearest Hospital & ASV Locator Section */}
      <HospitalLocatorSection />

      {/* Common Regional Snakes Directory (Venomous vs Non-Venomous) */}
      <CommonSnakesSection />

      {/* Common Agricultural Pests & Stinging Insects Directory */}
      <CommonInsectsSection />

      {/* Feature Pillar Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Antivenom & First Aid */}
          <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 sm:p-8 space-y-4 hover:border-border-strong transition-all shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-venom-deadly/10 text-venom-deadly flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">
                {t.nav.antivenom}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {t.hero.snakeCardDesc}
              </p>
            </div>
            <Link
              href={`/${locale}/snakes/antivenom`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-venom-deadly hover:underline mt-2"
            >
              <span>Explore Antivenom Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Golden Hour First Aid */}
          <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 sm:p-8 space-y-4 hover:border-border-strong transition-all shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">
                {t.nav.firstAid}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Evidence-based medical management protocols. Understand why
                cutting or tourniquets cause fatal complications and learn limb
                immobilization.
              </p>
            </div>
            <Link
              href={`/${locale}/snakes/first-aid`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline mt-2"
            >
              <span>View First Aid Protocols</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Dosage Calculator */}
          <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 sm:p-8 space-y-4 hover:border-border-strong transition-all shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">
                {t.nav.dosage}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Protect fruit orchards (mango, litchi) and paddy crops from
                over-dilution or chemical burn with accurate knapsack sprayer
                calculations.
              </p>
            </div>
            <Link
              href={`/${locale}/pests/dosage`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-accent hover:underline mt-2"
            >
              <span>Launch Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Hotline Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-emergency-red text-emergency-foreground p-8 sm:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider opacity-85">
              Instant 24/7 Medical Assistance
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.emergency.hotlineHeader}
            </h3>
            <p className="text-xs sm:text-sm opacity-90 max-w-xl">
              In case of snakebite envenomation, every minute counts. Never
              delay for traditional healing. Contact your national emergency
              service immediately.
            </p>
          </div>

          <Link
            href={`/${locale}/emergency`}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-bg-surface text-emergency-red font-bold text-sm sm:text-base hover:bg-bg-subtle transition-all shadow-md shrink-0 active:scale-95"
          >
            <PhoneCall className="w-5 h-5" />
            <span>{t.emergency.callNow}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
