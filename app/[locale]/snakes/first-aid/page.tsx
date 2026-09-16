'use client';

import React from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  CheckCircle2,
  XCircle,
  PhoneCall,
} from 'lucide-react';
import { useTranslation } from '../../../../src/i18n/LocaleContext';
import { FirstAidChecklist } from '../../../../src/components/snakes/FirstAidChecklist';

export default function SnakeFirstAidPage() {
  const { locale, t } = useTranslation();

  const myths = [
    {
      myth: 'Tying a tight rope, wire, or tourniquet around the limb above the bite stops venom from spreading.',
      fact: 'FATAL MISTAKE: Arterial tourniquets cut off oxygenated blood to the limb. Within hours, tissue dies (gangrene) leading to surgical amputation. Worse, when the tourniquet is released at the hospital, an overwhelming tidal wave of venom surges into the heart and lungs, causing sudden cardiac arrest.',
    },
    {
      myth: 'Cutting the bite puncture with a blade or sucking out the venom with the mouth removes the poison.',
      fact: 'FATAL MISTAKE: Venom is injected deep into capillary beds or muscle tissue. Cutting causes massive uncontrollable hemorrhage (especially with viper bites that destroy blood clotting). Sucking introduces mouth bacteria, causing catastrophic sepsis, and can envenomate the rescuer if they have mouth sores.',
    },
    {
      myth: 'Applying traditional herbal pastes, battery carbon, snakestones, or cow dung neutralizes venom.',
      fact: 'FATAL MISTAKE: Snakestones and herbs have zero biochemical neutralization against venom proteins. Applying cow dung or unsterile mud introduces Clostridium tetani (tetanus) and gas gangrene into open wounds.',
    },
    {
      myth: 'Visiting traditional snake charmers ("Ojha" / "Gunin" / "Babaji") cures snakebite.',
      fact: 'FATAL MISTAKE: Over 70% of snakebites in rural South Asia are from harmless non-venomous snakes or "dry bites" (where venomous snakes bite defensively without injecting venom). Quacks take credit for these natural survivals. But when a true envenomation occurs, victims die from wasted hours.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold border border-brand-primary/20">
          <HeartPulse className="w-4 h-4" />
          <span>Evidence-Based Clinical Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
          {t.nav.firstAid}
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-text-secondary">
          The &quot;Golden Hour&quot; is the first 60 to 120 minutes following a
          snakebite. Following correct medical first aid and avoiding
          traditional dangerous myths directly determines survival.
        </p>
      </div>

      {/* Main First Aid Checklist Component */}
      <FirstAidChecklist />

      {/* Deep-Dive: Fatal Traditional Myths Debunked */}
      <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold text-venom-deadly uppercase tracking-wider">
            Critical Public Health Education
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Why Traditional Practices Lead to Fatalities (Myths Debunked)
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            The World Health Organization (WHO) and National Toxicology
            Guidelines explicitly warn against these 4 dangerous traditional
            practices.
          </p>
        </div>

        <div className="space-y-4">
          {myths.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-bg-subtle border border-border-subtle space-y-2"
            >
              <div className="flex items-start gap-2.5 text-venom-deadly">
                <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <h3 className="text-sm sm:text-base font-bold text-text-primary">
                  {item.myth}
                </h3>
              </div>
              <div className="flex items-start gap-2.5 text-venom-safe pl-1">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {item.fact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Call Banner */}
      <div className="rounded-3xl bg-emergency-red text-emergency-foreground p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold">
            Bitten Right Now? Do Not Read Further.
          </h3>
          <p className="text-xs sm:text-sm opacity-90">
            Immobilize the limb immediately and rush to the nearest
            Upazila/District government hospital.
          </p>
        </div>
        <Link
          href={`/${locale}/emergency`}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-bg-surface text-emergency-red font-bold text-sm hover:bg-bg-subtle transition-colors shadow-xs shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call National Emergency</span>
        </Link>
      </div>
    </div>
  );
}
