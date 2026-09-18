'use client';

import React from 'react';
import {
  PhoneCall,
  MapPin,
  Clock,
  RefreshCw,
  Loader2,
  Building2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { useGetEmergencyLogsQuery } from '@/store/api/adminApi';

export default function AdminEmergencyLogsPage() {
  const {
    data: logs = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetEmergencyLogsQuery();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight flex items-center gap-2.5">
            <PhoneCall className="w-7 h-7 text-brand-primary" />
            <span>Emergency SOS Dispatch Monitor</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real-time tracking of distress calls triggered from the emergency
            antivenom locator.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-4 py-2 rounded-xl border border-border-subtle bg-bg-surface hover:bg-bg-subtle text-text-primary font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`}
          />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl bg-bg-surface border border-border-subtle shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center gap-2 text-text-muted text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
            <span>Loading SOS dispatch logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-bg-subtle text-text-muted flex items-center justify-center mx-auto">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-text-primary">
              No Emergency Calls Logged
            </div>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              When victims or bystanders trigger the SOS button on the Emergency
              page, their GPS coordinates and clinical notes will stream here in
              real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-subtle text-text-secondary uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-4">Caller Contact</th>
                  <th className="p-4">Clinical Notes / Bite Circumstances</th>
                  <th className="p-4">Targeted Hospital</th>
                  <th className="p-4">GPS Location</th>
                  <th className="p-4">Logged Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-bg-subtle/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-sm text-text-primary">
                        {log.callerPhone ? (
                          <a
                            href={`tel:${log.callerPhone}`}
                            className="text-brand-primary hover:underline flex items-center gap-1.5 font-mono"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>{log.callerPhone}</span>
                          </a>
                        ) : (
                          <span className="text-text-muted">
                            Anonymous Caller
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-text-muted font-mono mt-0.5">
                        ID: {log.id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="p-4 max-w-md">
                      <div className="text-text-primary font-medium">
                        {log.notes || 'No description provided'}
                      </div>
                      {log.user && (
                        <div className="text-[10px] text-text-muted mt-1">
                          Reported by user: {log.user.name} ({log.user.email})
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {log.hospital ? (
                        <div>
                          <div className="font-bold text-text-primary">
                            {log.hospital.name}
                          </div>
                          <div className="text-[11px] text-text-muted">
                            Hotline: {log.hospital.hotline}
                          </div>
                        </div>
                      ) : log.hospitalId ? (
                        <span className="font-mono text-text-secondary">
                          {log.hospitalId}
                        </span>
                      ) : (
                        <span className="text-text-muted italic">
                          Nearest Facility Auto-Dispatch
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {log.latitude && log.longitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary font-mono text-[11px] font-bold hover:bg-brand-primary/20 transition"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>
                            {log.latitude.toFixed(4)},{' '}
                            {log.longitude.toFixed(4)}
                          </span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      ) : (
                        <span className="text-text-muted">Unavailable</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-text-muted">
                      {new Date(log.createdAt).toLocaleDateString()}{' '}
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
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
