import { baseApi } from './baseApi';
import type { IPest, IIdentificationResult } from '../../core/interfaces';
import type { CropType } from '../../core/types';
import { MOCK_PESTS } from '../../core/data/mockData';

export const pestApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    identifyPest: builder.mutation<IIdentificationResult, FormData>({
      queryFn: async formData => {
        try {
          // Attempt real API call to Nest.js backend
          const response = await fetch('/api/v1/pests/identify', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            return { data };
          }
        } catch {
          // fallback
        }

        const cropType = (formData.get('cropType') as string) || 'mango';
        const matchedPest =
          MOCK_PESTS.find(p =>
            p.damageProfile.affectedCrops.includes(cropType as CropType),
          ) || MOCK_PESTS[0];

        const result: IIdentificationResult = {
          id: `pest-ident-${Date.now()}`,
          type: 'pest',
          confidence: 0.92,
          analyzedAt: new Date().toISOString(),
          pestData: matchedPest,
          alternativeMatches: [
            { name: MOCK_PESTS[1].commonName.en, confidence: 0.05 },
            { name: MOCK_PESTS[2].commonName.en, confidence: 0.03 },
          ],
        };

        return { data: result };
      },
      invalidatesTags: ['Pests'],
    }),

    getPestById: builder.query<IPest, string>({
      queryFn: async id => {
        try {
          const res = await fetch(`/api/v1/pests/${id}`);
          if (res.ok) {
            const data = await res.json();
            return { data };
          }
        } catch {
          // fallback
        }
        const found = MOCK_PESTS.find(p => p.id === id) || MOCK_PESTS[0];
        return { data: found };
      },
      providesTags: (_res, _err, id) => [{ type: 'Pests', id }],
    }),

    getPestsList: builder.query<IPest[], void>({
      queryFn: async () => {
        try {
          const res = await fetch('/api/v1/pests');
          if (res.ok) {
            const data = await res.json();
            return { data };
          }
        } catch {
          // fallback
        }
        return { data: MOCK_PESTS };
      },
      providesTags: ['Pests'],
    }),
  }),
});

export const {
  useIdentifyPestMutation,
  useGetPestByIdQuery,
  useGetPestsListQuery,
} = pestApi;
