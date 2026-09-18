'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  Building2,
  ShieldCheck,
  MapPin,
  Navigation,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { useTranslation } from '@/i18n/LocaleContext';
import { MOCK_HOSPITALS } from '@/core/data/mockData';
import {
  useGetEmergencyHospitalsQuery,
  useGetHotlinesQuery,
  useTriggerSosCallMutation,
} from '@/store/api/emergencyApi';

export default function EmergencyPage() {
  const { t } = useTranslation();
  const [countryFilter, setCountryFilter] = useState<
    'ALL' | 'BD' | 'IN' | 'PK'
  >('ALL');
  const [callerPhone, setCallerPhone] = useState('');
  const [sosNotes, setSosNotes] = useState('');
  const [sosSuccess, setSosSuccess] = useState<{
    logId: string;
    instructions: string[];
  } | null>(null);

  const { data: hospitals = MOCK_HOSPITALS, isLoading: isHospitalsLoading } =
    useGetEmergencyHospitalsQuery(
      countryFilter !== 'ALL' ? { country: countryFilter } : undefined,
    );

  const { data: hotlines } = useGetHotlinesQuery();
  const [triggerSos, { isLoading: isSosDispatching }] =
    useTriggerSosCallMutation();

  const handleSosDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let lat: number | undefined;
      let lng: number | undefined;

      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 3000,
              });
            },
          );
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch {
          // GPS optional
        }
      }

      const res = await triggerSos({
        callerPhone: callerPhone || undefined,
        latitude: lat,
        longitude: lng,
        notes: sosNotes || 'Emergency snakebite SOS alert from web portal',
      }).unwrap();

      setSosSuccess({
        logId: res.logId,
        instructions: res.instructions || [
          'Keep patient completely still to delay venom diffusion.',
          'Immobilize bitten limb with a rigid splint at heart level.',
          'Rush immediately to an emergency hospital with ASV.',
        ],
      });
      setSosNotes('');
    } catch (err) {
      console.error('SOS dispatch error:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emergency-red/10 text-emergency-red text-xs font-bold border border-emergency-red/20">
          <PhoneCall className="w-4 h-4 animate-pulse" />
          <span>Immediate Snakebite Medical Response</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
          {t.emergency.title}
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-text-secondary">
          In a snakebite emergency, do not wait for symptoms to worsen. Call
          national emergency hotlines or rush to the nearest government hospital
          equipped with Polyvalent Anti-Snake Venom (ASV).
        </p>
      </div>

      {/* Emergency SOS Dispatch Interactive Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-emergency-red/10 via-bg-surface to-bg-surface border-2 border-emergency-red/30 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-emergency-red font-bold text-xs uppercase tracking-wider">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Real-Time Medical SOS Dispatch</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary">
              Log Emergency Incident to Regional Network
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              Transmits your coordinates and victim phone number to our
              emergency database.
            </p>
          </div>
        </div>

        {sosSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>SOS Alert Recorded! Reference ID: {sosSuccess.logId}</span>
            </div>
            <div className="space-y-1 text-xs text-text-secondary">
              <p className="font-semibold text-text-primary">
                Immediate Clinical Protocols:
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                {sosSuccess.instructions.map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setSosSuccess(null)}
              className="px-3 py-1.5 rounded-lg bg-bg-surface text-xs font-semibold text-text-primary border border-border-subtle"
            >
              Log Another Incident
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSosDispatch}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <input
              type="tel"
              value={callerPhone}
              onChange={e => setCallerPhone(e.target.value)}
              placeholder="Caller Phone (+880 / +91...)"
              className="px-4 py-2.5 rounded-xl bg-bg-subtle border border-border-subtle text-text-primary text-xs sm:text-sm focus:outline-hidden focus:border-emergency-red"
            />
            <input
              type="text"
              value={sosNotes}
              onChange={e => setSosNotes(e.target.value)}
              placeholder="Condition (e.g. bitten by Russell's Viper, swelling...)"
              className="px-4 py-2.5 rounded-xl bg-bg-subtle border border-border-subtle text-text-primary text-xs sm:text-sm focus:outline-hidden focus:border-emergency-red"
            />
            <button
              type="submit"
              disabled={isSosDispatching}
              className="px-4 py-2.5 rounded-xl bg-emergency-red hover:bg-emergency-hover text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSosDispatching ? 'Dispatching...' : 'Dispatch SOS Alert'}
              </span>
            </button>
          </form>
        )}
      </div>

      {/* 24/7 National Emergency Hotlines Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bangladesh Card */}
        <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary font-bold text-xs">
              Bangladesh
            </span>
            <PhoneCall className="w-5 h-5 text-emergency-red" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text-primary">
              Shastho Batayon / National
            </h3>
            <p className="text-xs text-text-muted">
              Direct line to government doctors & emergency ambulance
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <a
              href="tel:16263"
              className="w-full py-2.5 px-4 rounded-xl bg-emergency-red text-emergency-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-emergency-hover transition-colors shadow-xs"
            >
              <span>Call 16263 (Health)</span>
            </a>
            <a
              href="tel:999"
              className="w-full py-2 px-4 rounded-xl bg-bg-subtle text-text-primary font-semibold text-xs flex items-center justify-center gap-2 hover:bg-border-subtle transition-colors border border-border-subtle"
            >
              <span>Call 999 (National Emergency)</span>
            </a>
          </div>
        </div>

        {/* India Card */}
        <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg bg-antivenom-tag/10 text-antivenom-tag font-bold text-xs">
              India
            </span>
            <PhoneCall className="w-5 h-5 text-emergency-red" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text-primary">
              National Emergency & Poison
            </h3>
            <p className="text-xs text-text-muted">
              Ambulance dispatch and AIIMS poison guidance
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <a
              href="tel:108"
              className="w-full py-2.5 px-4 rounded-xl bg-emergency-red text-emergency-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-emergency-hover transition-colors shadow-xs"
            >
              <span>Call 108 (Ambulance)</span>
            </a>
            <a
              href="tel:1800116117"
              className="w-full py-2 px-4 rounded-xl bg-bg-subtle text-text-primary font-semibold text-xs flex items-center justify-center gap-2 hover:bg-border-subtle transition-colors border border-border-subtle"
            >
              <span>AIIMS Poison: 1800-116-117</span>
            </a>
          </div>
        </div>

        {/* Pakistan Card */}
        <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary font-bold text-xs">
              Pakistan
            </span>
            <PhoneCall className="w-5 h-5 text-emergency-red" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text-primary">
              Rescue 1122 Emergency
            </h3>
            <p className="text-xs text-text-muted">
              Emergency rescue service and hospital transfer
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <a
              href="tel:1122"
              className="w-full py-2.5 px-4 rounded-xl bg-emergency-red text-emergency-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-emergency-hover transition-colors shadow-xs"
            >
              <span>Call 1122 (Rescue)</span>
            </a>
            <a
              href="tel:1166"
              className="w-full py-2 px-4 rounded-xl bg-bg-subtle text-text-primary font-semibold text-xs flex items-center justify-center gap-2 hover:bg-border-subtle transition-colors border border-border-subtle"
            >
              <span>National Health: 1166</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hospital Locator Directory */}
      <div className="rounded-3xl border border-border-subtle bg-bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Toxicology Centers ({hospitals.length} Facilities)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
              Designated Hospitals with Antivenom Supply
            </h2>
          </div>

          {/* Country Filter Buttons */}
          <div className="inline-flex p-1 rounded-xl bg-bg-subtle border border-border-subtle gap-1">
            {(['ALL', 'BD', 'IN', 'PK'] as const).map(code => (
              <button
                key={code}
                type="button"
                onClick={() => setCountryFilter(code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  countryFilter === code
                    ? 'bg-bg-surface text-text-primary shadow-xs'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {code === 'ALL'
                  ? 'All'
                  : code === 'BD'
                    ? 'Bangladesh'
                    : code === 'IN'
                      ? 'India'
                      : 'Pakistan'}
              </button>
            ))}
          </div>
        </div>

        {/* Hospital List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitals.map(h => (
            <div
              key={h.id}
              className="p-5 rounded-2xl bg-bg-subtle border border-border-subtle space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary">
                    {h.country === 'BD'
                      ? 'Bangladesh'
                      : h.country === 'IN'
                        ? 'India'
                        : 'Pakistan'}
                  </span>
                  {h.hasAntivenomStock && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-venom-safe">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ASV Stocked</span>
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-text-primary leading-snug">
                  {h.name}
                </h3>
                <div className="flex items-start gap-1.5 text-xs text-text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
                  <span>{h.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${h.hotline}`}
                  className="py-2 px-3 rounded-xl bg-emergency-red text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-emergency-hover transition-colors shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {h.hotline}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-bg-surface border border-border-strong text-text-primary font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-bg-subtle transition-colors shadow-2xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
