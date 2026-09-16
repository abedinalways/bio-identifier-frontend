import { baseApi } from './baseApi';
import type { IEmergencyHospital } from '../../core/interfaces';
import { MOCK_HOSPITALS } from '../../core/data/mockData';

export const emergencyApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getEmergencyHospitals: builder.query<
      IEmergencyHospital[],
      { country?: string }
    >({
      queryFn: async ({ country }) => {
        try {
          const res = await fetch(
            `/api/v1/emergency/hospitals?country=${country || ''}`,
          );
          if (res.ok) {
            const data = await res.json();
            return { data };
          }
        } catch {
          // fallback
        }
        if (country) {
          return { data: MOCK_HOSPITALS.filter(h => h.country === country) };
        }
        return { data: MOCK_HOSPITALS };
      },
      providesTags: ['Emergency'],
    }),
  }),
});

export const { useGetEmergencyHospitalsQuery } = emergencyApi;
