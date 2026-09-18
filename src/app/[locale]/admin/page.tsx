'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ShieldAlert,
  Bug,
  Building2,
  PhoneCall,
  Plus,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useGetSnakesListQuery } from '@/store/api/snakeApi';
import { useGetPestsListQuery } from '@/store/api/pestApi';
import { useGetEmergencyHospitalsQuery } from '@/store/api/emergencyApi';
import { useGetEmergencyLogsQuery } from '@/store/api/adminApi';

export default function AdminOverviewPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const { user } = useAppSelector(state => state.auth);

  const { data: snakes = [] } = useGetSnakesListQuery();
  const { data: pests = [] } = useGetPestsListQuery();
  const { data: hospitals = [] } = useGetEmergencyHospitalsQuery();
  const { data: sosLogs = [] } = useGetEmergencyLogsQuery();

  const venomousCount = snakes.filter(s => s.venomProfile?.isVenomous).length;
  const criticalPestCount = pests.filter(
    p => p.damageProfile?.severity === 'critical',
  ).length;
  const asvHospitalsCount = hospitals.filter(h => h.hasAntivenomStock).length;

  const statCards = [
    {
      title: 'Snakes Encyclopedia',
      total: snakes.length,
      subtitle: `${venomousCount} deadly venomous species`,
      icon: ShieldAlert,
      color: 'text-venom-deadly bg-venom-deadly/10 border-venom-deadly/20',
      href: `/${locale}/admin/snakes`,
    },
    {
      title: 'Agricultural Pests',
      total: pests.length,
      subtitle: `${criticalPestCount} high-severity crop threats`,
      icon: Bug,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      href: `/${locale}/admin/pests`,
    },
    {
      title: 'Emergency Hospitals',
      total: hospitals.length,
      subtitle: `${asvHospitalsCount} with verified ASV stock`,
      icon: Building2,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      href: `/${locale}/admin/hospitals`,
    },
    {
      title: 'SOS Emergency Alerts',
      total: sosLogs.length,
      subtitle: 'Recorded clinical dispatches',
      icon: PhoneCall,
      color: 'text-brand-primary bg-brand-primary/10 border-brand-primary/20',
      href: `/${locale}/admin/emergency-logs`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-brand-primary/10 via-brand-primary/5 to-transparent border border-brand-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold border border-brand-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Operational Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl">
            Monitor biodiversity databases, update regional antivenom medical
            facilities, and inspect field identification queries across South
            Asia.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            href={`/${locale}/admin/snakes`}
            className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Snake</span>
          </Link>
          <Link
            href={`/${locale}/admin/pests`}
            className="px-4 py-2.5 rounded-xl bg-bg-surface hover:bg-bg-subtle text-text-primary font-bold text-xs border border-border-subtle shadow-xs transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pest</span>
          </Link>
          <Link
            href={`/${locale}/admin/hospitals`}
            className="px-4 py-2.5 rounded-xl bg-bg-surface hover:bg-bg-subtle text-text-primary font-bold text-xs border border-border-subtle shadow-xs transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hospital</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="p-6 rounded-3xl bg-bg-surface border border-border-subtle hover:border-brand-primary/40 shadow-xs hover:shadow-md transition space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition" />
              </div>
              <div>
                <div className="text-3xl font-black text-text-primary tracking-tight">
                  {card.total}
                </div>
                <div className="text-xs font-bold text-text-secondary mt-0.5">
                  {card.title}
                </div>
                <div className="text-[11px] text-text-muted mt-1 font-medium">
                  {card.subtitle}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Emergency SOS Dispatches */}
      <div className="rounded-3xl bg-bg-surface border border-border-subtle shadow-xs overflow-hidden">
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-extrabold text-text-primary flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-brand-primary" />
              <span>Recent Emergency SOS Dispatches</span>
            </h2>
            <p className="text-xs text-text-secondary">
              Real-time records from distress calls requiring clinical antivenom
              coordination.
            </p>
          </div>
          <Link
            href={`/${locale}/admin/emergency-logs`}
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {sosLogs.length === 0 ? (
          <div className="p-10 text-center text-text-muted text-xs">
            No emergency distress calls logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-subtle text-text-secondary uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-4">Caller Contact</th>
                  <th className="p-4">Bite Details / Notes</th>
                  <th className="p-4">Assigned Hospital</th>
                  <th className="p-4">GPS Coordinates</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {sosLogs.slice(0, 5).map(log => (
                  <tr key={log.id} className="hover:bg-bg-subtle/50 transition">
                    <td className="p-4 font-bold text-text-primary">
                      {log.callerPhone || 'Anonymous Caller'}
                    </td>
                    <td className="p-4 text-text-secondary max-w-xs truncate">
                      {log.notes || 'No symptoms noted'}
                    </td>
                    <td className="p-4 text-text-primary font-medium">
                      {log.hospital?.name ||
                        log.hospitalId ||
                        'General Regional Queue'}
                    </td>
                    <td className="p-4">
                      {log.latitude && log.longitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-primary hover:underline font-mono text-[11px]"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>
                            {log.latitude.toFixed(3)},{' '}
                            {log.longitude.toFixed(3)}
                          </span>
                        </a>
                      ) : (
                        <span className="text-text-muted">Unspecified</span>
                      )}
                    </td>
                    <td className="p-4 text-text-muted font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleDateString()}{' '}
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
