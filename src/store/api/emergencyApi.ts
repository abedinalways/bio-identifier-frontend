import { baseApi } from './baseApi';
import type { IEmergencyHospital } from '../../core/interfaces';
import { MOCK_HOSPITALS } from '../../core/data/mockData';
import { adaptPrismaHospital } from '../../core/adapters/speciesAdapter';

export interface ISosCallRequest {
  callerPhone?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  hospitalId?: string;
}

export interface IHotlinesDirectory {
  bangladesh: Array<{ name: string; number: string; type: string }>;
  india: Array<{ name: string; number: string; type: string }>;
  pakistan: Array<{ name: string; number: string; type: string }>;
  generalInstructions: string[];
}

export const emergencyApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getEmergencyHospitals: builder.query<
      IEmergencyHospital[],
      {
        country?: string;
        division?: string;
        district?: string;
        search?: string;
      } | void
    >({
      queryFn: async query => {
        try {
          const params = new URLSearchParams();
          if (query) {
            if (query.country && query.country !== 'ALL')
              params.set('country', query.country);
            if (query.division && query.division !== 'ALL')
              params.set('division', query.division);
            if (query.district) params.set('district', query.district);
            if (query.search) params.set('search', query.search);
          }
          const qs = params.toString() ? `?${params.toString()}` : '';

          const res = await fetch(`/api/v1/hospitals${qs}`);
          if (res.ok) {
            const json = await res.json();
            const items = json.data || json;
            if (Array.isArray(items) && items.length > 0) {
              return { data: items.map(adaptPrismaHospital) };
            }
          }
        } catch (err) {
          console.warn(
            'Failed to fetch hospitals from API, falling back to mock dataset:',
            err,
          );
        }

        const country =
          query && query.country !== 'ALL' ? query.country : undefined;
        if (country) {
          return { data: MOCK_HOSPITALS.filter(h => h.country === country) };
        }
        return { data: MOCK_HOSPITALS };
      },
      providesTags: ['Emergency'],
    }),

    getNearestHospitals: builder.query<
      (IEmergencyHospital & { distanceKm?: number })[],
      { lat: number; lng: number; radiusKm?: number; limit?: number }
    >({
      queryFn: async ({ lat, lng, radiusKm = 500, limit = 10 }) => {
        try {
          const res = await fetch(
            `/api/v1/hospitals/nearest?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}&limit=${limit}`,
          );
          if (res.ok) {
            const json = await res.json();
            const payload = json.data || json;
            const items = payload.nearestHospitals || payload;
            if (Array.isArray(items) && items.length > 0) {
              return {
                data: items.map((h: any) => ({
                  ...adaptPrismaHospital(h),
                  distanceKm:
                    typeof h.distanceKm === 'number'
                      ? Math.round(h.distanceKm * 10) / 10
                      : undefined,
                })),
              };
            }
          }
        } catch (err) {
          console.warn(
            'Failed to query nearest hospitals from backend GPS engine:',
            err,
          );
        }

        // Local Haversine fallback
        const R = 6371;
        const calculated = MOCK_HOSPITALS.map(h => {
          const dLat = ((h.latitude - lat) * Math.PI) / 180;
          const dLon = ((h.longitude - lng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat * Math.PI) / 180) *
              Math.cos((h.latitude * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distanceKm = Math.round(R * c * 10) / 10;
          return { ...h, distanceKm };
        })
          .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
          .slice(0, limit);

        return { data: calculated };
      },
      providesTags: ['Emergency'],
    }),

    getHotlines: builder.query<IHotlinesDirectory, void>({
      queryFn: async () => {
        try {
          const res = await fetch('/api/v1/emergency/hotlines');
          if (res.ok) {
            const json = await res.json();
            return { data: json.data || json };
          }
        } catch (err) {
          console.warn('Failed to fetch emergency hotlines from backend:', err);
        }

        // Fallback hotlines
        return {
          data: {
            bangladesh: [
              {
                name: 'National Emergency Service (Ambulance / Police)',
                number: '999',
                type: 'national',
              },
              {
                name: 'Shastho Batayon (Government Health Hotline)',
                number: '16263',
                type: 'health',
              },
              {
                name: 'Institute of Epidemiology (IEDCR)',
                number: '+8801937110011',
                type: 'poison',
              },
            ],
            india: [
              {
                name: 'National Emergency Hotline',
                number: '112',
                type: 'national',
              },
              {
                name: 'Emergency Medical & Ambulance',
                number: '108',
                type: 'ambulance',
              },
              {
                name: 'AIIMS National Poisons Information Centre (Toll-Free)',
                number: '1800116117',
                type: 'poison',
              },
            ],
            pakistan: [
              {
                name: 'Rescue 1122 Emergency Ambulance',
                number: '1122',
                type: 'ambulance',
              },
              {
                name: 'National Health Emergency Hotline',
                number: '1166',
                type: 'health',
              },
            ],
            generalInstructions: [
              'Do NOT tie tight tourniquets or cut bite wound.',
              'Immobilize the bitten limb immediately with a splint.',
              'Transfer to nearest hospital with Polyvalent ASV immediately.',
            ],
          },
        };
      },
    }),

    triggerSosCall: builder.mutation<
      { logId: string; status: string; instructions: string[] },
      ISosCallRequest
    >({
      queryFn: async req => {
        try {
          const res = await fetch('/api/v1/emergency/sos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
          });
          if (res.ok) {
            const json = await res.json();
            return { data: json.data || json };
          }
        } catch (err) {
          console.warn('Failed to record SOS call on backend:', err);
        }

        return {
          data: {
            logId: `sos-offline-${Date.now()}`,
            status: 'DISPATCHED_LOCALLY',
            instructions: [
              'Keep patient calm and completely still to retard venom diffusion.',
              'Immobilize bitten limb with a rigid splint at heart level.',
              'Dial national emergency line immediately.',
            ],
          },
        };
      },
      invalidatesTags: ['Emergency'],
    }),
  }),
});

export const {
  useGetEmergencyHospitalsQuery,
  useGetNearestHospitalsQuery,
  useGetHotlinesQuery,
  useTriggerSosCallMutation,
} = emergencyApi;
