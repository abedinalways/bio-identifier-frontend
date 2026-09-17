'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  PhoneCall,
  Navigation,
  ShieldCheck,
  Building2,
  Compass,
  AlertCircle,
  ExternalLink,
  Search,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LocaleContext';
import { MOCK_HOSPITALS } from '../../core/data/mockData';
import { useGetEmergencyHospitalsQuery } from '../../store/api/emergencyApi';

function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const HospitalLocatorSection: React.FC = () => {
  const { t } = useTranslation();
  const { data: hospitals = MOCK_HOSPITALS } = useGetEmergencyHospitalsQuery();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique divisions from hospital data
  const divisions = useMemo(() => {
    const set = new Set<string>();
    hospitals.forEach(h => {
      if (h.division) set.add(h.division);
    });
    return Array.from(set);
  }, [hospitals]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      err => {
        console.warn('Geolocation failed:', err.message);
        setLocationError(t.hospitalLocator.locationError);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // Process and sort hospitals
  const sortedHospitals = useMemo(() => {
    let list = hospitals.map(h => {
      let distance: number | undefined = undefined;
      if (userLocation) {
        distance = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          h.latitude,
          h.longitude,
        );
      }
      return { ...h, distance };
    });

    // Filter by Division
    if (selectedDivision !== 'ALL') {
      list = list.filter(h => h.division === selectedDivision);
    }

    // Filter by Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        h =>
          h.name.toLowerCase().includes(q) ||
          h.district.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q),
      );
    }

    // Sort by distance if user location is known
    if (userLocation) {
      list.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return list;
  }, [userLocation, selectedDivision, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emergency-red/10 text-emergency-red text-xs font-bold border border-emergency-red/20 shadow-2xs">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>{t.hospitalLocator.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            {t.hospitalLocator.title}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {t.hospitalLocator.subtitle}
          </p>
        </div>

        {/* GPS Locate Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isLocating}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emergency-red hover:bg-emergency-hover text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0"
          >
            <Compass
              className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`}
            />
            <span>
              {isLocating
                ? t.hospitalLocator.locating
                : userLocation
                  ? 'Update My Location'
                  : t.hospitalLocator.findNearMe}
            </span>
          </button>
        </div>
      </div>

      {/* Critical Golden Hour Advisory Banner */}
      <div className="rounded-3xl border border-emergency-red/30 bg-emergency-red/5 p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emergency-red text-white shrink-0 mt-0.5">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-emergency-red">
                {t.hospitalLocator.emergencyRuleTitle}
              </h4>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-0.5">
                {t.hospitalLocator.emergencyRuleDesc}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0">
            <a
              href="tel:16263"
              className="px-3.5 py-2 rounded-xl bg-bg-surface border border-border-strong text-text-primary text-xs font-bold flex items-center gap-1.5 hover:bg-bg-subtle transition-colors shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emergency-red" />
              <span>16263 (Shastho Batayon)</span>
            </a>
            <a
              href="tel:999"
              className="px-3.5 py-2 rounded-xl bg-bg-surface border border-border-strong text-text-primary text-xs font-bold flex items-center gap-1.5 hover:bg-bg-subtle transition-colors shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emergency-red" />
              <span>999 (Emergency)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Location Error alert if failed */}
      {locationError && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Division Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-bg-subtle border border-border-subtle w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedDivision('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDivision === 'ALL'
                ? 'bg-bg-surface text-text-primary shadow-xs border border-border-subtle'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {t.hospitalLocator.allDivisions}
          </button>
          {divisions.map(div => (
            <button
              key={div}
              type="button"
              onClick={() => setSelectedDivision(div)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDivision === div
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {div}
            </button>
          ))}
        </div>

        {/* Hospital Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search hospital or district..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-surface border border-border-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-emergency-red focus:ring-1 focus:ring-emergency-red shadow-2xs"
          />
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedHospitals.map(h => {
          const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`;

          return (
            <div
              key={h.id}
              className="card-hover rounded-3xl border border-border-subtle bg-bg-surface p-6 space-y-5 shadow-xs hover:border-emergency-red/40 hover:shadow-lg transition-all flex flex-col justify-between relative ring-1 ring-border-subtle/50"
            >
              <div className="space-y-3">
                {/* Status Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {h.hasAntivenomStock && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-venom-safe-subtle text-venom-safe border border-venom-safe-border text-[11px] font-bold shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t.hospitalLocator.asvStocked}</span>
                      </span>
                    )}
                    {h.icuAvailable && (
                      <span className="px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[11px] font-bold shadow-2xs">
                        {t.hospitalLocator.icuBadge}
                      </span>
                    )}
                  </div>

                  {/* Calculated Live Distance with Pulse Pin */}
                  {h.distance !== undefined && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emergency-red/10 text-emergency-red font-black text-xs border border-emergency-red/20 shadow-2xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emergency-red opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emergency-red" />
                      </span>
                      <span>
                        {h.distance} {t.hospitalLocator.distanceKm}
                      </span>
                    </span>
                  )}
                </div>

                {/* Hospital Name & Emergency Ward */}
                <div className="space-y-1 pt-1">
                  <h3 className="text-base font-bold text-text-primary leading-snug">
                    {h.name}
                  </h3>
                  {h.emergencyUnit && (
                    <p className="text-xs font-semibold text-emergency-red flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{h.emergencyUnit}</span>
                    </p>
                  )}
                </div>

                {/* Location Address */}
                <div className="flex items-start gap-2 text-xs text-text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
                  <span>{h.address}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {/* 1-Click Phone Call */}
                <a
                  href={`tel:${h.hotline}`}
                  className="py-2.5 px-3 rounded-xl bg-emergency-red hover:bg-emergency-hover text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emergency-red/20 transition-all active:scale-95"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{t.hospitalLocator.callHospital}</span>
                </a>

                {/* Google Maps Directions */}
                <a
                  href={gmapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-bg-surface hover:bg-bg-subtle border border-border-strong text-text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs hover:border-brand-primary"
                >
                  <Navigation className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{t.hospitalLocator.getDirections}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {sortedHospitals.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-bg-surface border border-border-subtle space-y-2">
          <p className="text-sm font-bold text-text-primary">
            No hospitals found matching your criteria
          </p>
          <p className="text-xs text-text-muted">
            Try selecting &quot;All Divisions&quot; or clearing your search.
          </p>
        </div>
      )}

      {/* Fallback Google Maps Global Search Banner */}
      <div className="p-6 rounded-3xl bg-bg-surface border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary">
              Looking for hospitals outside our verified list?
            </h4>
            <p className="text-xs text-text-secondary">
              Open Google Maps to view all nearby hospitals and emergency
              clinics in your immediate area.
            </p>
          </div>
        </div>

        <a
          href={
            userLocation
              ? `https://www.google.com/maps/search/hospital+emergency+antivenom/@${userLocation.lat},${userLocation.lng},13z`
              : 'https://www.google.com/maps/search/hospital+emergency+near+me'
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-subtle hover:bg-border-subtle border border-border-strong text-text-primary text-xs font-bold transition-all shrink-0"
        >
          <span>{t.hospitalLocator.searchGoogleMaps}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};
