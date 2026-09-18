'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, AlertOctagon, Building2, PhoneCall } from 'lucide-react';
import { useTranslation } from '@/i18n/LocaleContext';

export default function AntivenomGuidePage() {
  const { locale, t } = useTranslation();

  const manufacturers = [
    {
      country: 'Bangladesh',
      brand: 'Incepta Antivenom / National ASV Program',
      description:
        'Manufactured and distributed primarily to government medical college hospitals and Upazila Health Complexes.',
    },
    {
      country: 'India',
      brand: 'Bharat Serums and Vaccines Ltd (BSV)',
      description:
        "Widely supplied lyophilized polyvalent ASV active against Indian Cobra, Common Krait, Russell's Viper, and Saw-scaled Viper.",
    },
    {
      country: 'India',
      brand: 'Haffkine Bio-Pharmaceutical Corporation',
      description:
        'One of the oldest biological producers in South Asia producing purified equine polyvalent immunoglobulins.',
    },
    {
      country: 'India / Regional',
      brand: 'VINS Bio-Products Limited',
      description:
        'Produces freeze-dried (lyophilized) enzyme-refined polyvalent anti-snake venom serum with high stability at tropical ambient temperatures.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-antivenom-tag/10 text-antivenom-tag text-xs font-bold border border-antivenom-tag/20">
          <Activity className="w-4 h-4" />
          <span>Clinical ASV Resource Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
          {t.nav.antivenom}
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-text-secondary">
          Comprehensive guide to Polyvalent Anti-Snake Venom (ASV) in South
          Asia, regional manufacturers, clinical precautions, and emergency
          availability.
        </p>
      </div>

      {/* Critical Medical Warning Box */}
      <div className="p-6 rounded-3xl bg-venom-deadly text-venom-deadly-foreground shadow-md flex items-start gap-4">
        <AlertOctagon className="w-7 h-7 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold">
            Physician Administration Only (Critical Hospital Notice)
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed opacity-95">
            {t.snake.warningDoctor} Antivenom can induce acute anaphylactic
            shock in a small percentage of patients. Administration requires
            immediate access to intravenous adrenaline (epinephrine),
            antihistamines, hydrocortisone, and bag-valve-mask ventilatory
            support.
          </p>
        </div>
      </div>

      {/* What is Polyvalent Antivenom */}
      <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            Clinical Pharmacology
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            How South Asian Polyvalent ASV Works
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            In South Asia (Bangladesh, India, Pakistan, Nepal), standard medical
            protocols utilize <strong>Polyvalent Equine Antivenom</strong>. It
            is created by hyperimmunizing donor horses with venom from the four
            most medically significant venomous snakes (the &quot;Big
            Four&quot;):
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-bg-subtle border border-border-subtle space-y-1">
            <span className="text-xs font-bold text-venom-deadly">
              1. Spectacled Cobra
            </span>
            <p className="text-xs text-text-secondary italic">Naja naja</p>
            <p className="text-xs text-text-muted">Neurotoxic & Cardiotoxic</p>
          </div>
          <div className="p-4 rounded-2xl bg-bg-subtle border border-border-subtle space-y-1">
            <span className="text-xs font-bold text-venom-deadly">
              2. Common Krait
            </span>
            <p className="text-xs text-text-secondary italic">
              Bungarus caeruleus
            </p>
            <p className="text-xs text-text-muted">
              Potent Pre-synaptic Neurotoxic
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-bg-subtle border border-border-subtle space-y-1">
            <span className="text-xs font-bold text-venom-deadly">
              3. Russell&apos;s Viper
            </span>
            <p className="text-xs text-text-secondary italic">
              Daboia russelii
            </p>
            <p className="text-xs text-text-muted">Hemotoxic & Nephrotoxic</p>
          </div>
          <div className="p-4 rounded-2xl bg-bg-subtle border border-border-subtle space-y-1">
            <span className="text-xs font-bold text-venom-deadly">
              4. Saw-scaled Viper
            </span>
            <p className="text-xs text-text-secondary italic">
              Echis carinatus
            </p>
            <p className="text-xs text-text-muted">Hemotoxic & Anticoagulant</p>
          </div>
        </div>
      </div>

      {/* Regional Manufacturers & Commercial Brands */}
      <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
            <Building2 className="w-4 h-4" />
            <span>Approved Pharmaceutical Producers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Regional Antivenom Commercial Brands
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {manufacturers.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-bg-subtle border border-border-subtle space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary">
                  {m.country}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-text-primary">
                {m.brand}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hospital Stock Navigation */}
      <div className="rounded-3xl bg-bg-subtle border border-border-subtle p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-text-primary">
            Need to Locate a Hospital with Antivenom Stock?
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary">
            View government district hospitals and designated snakebite
            toxicology centers.
          </p>
        </div>

        <Link
          href={`/${locale}/emergency`}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-primary text-brand-primary-foreground font-semibold text-sm hover:bg-brand-primary-hover transition-colors shadow-xs shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>View Emergency Centers</span>
        </Link>
      </div>
    </div>
  );
}
