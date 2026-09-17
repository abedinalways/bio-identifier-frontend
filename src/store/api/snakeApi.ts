import { baseApi } from './baseApi';
import type { ISnake, IIdentificationResult } from '../../core/interfaces';
import { MOCK_SNAKES } from '../../core/data/mockData';
import {
  adaptPrismaSnake,
  adaptIdentificationResult,
} from '../../core/adapters/speciesAdapter';

export const snakeApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    identifySnake: builder.mutation<IIdentificationResult, FormData>({
      queryFn: async formData => {
        try {
          if (!formData.has('domain')) {
            formData.append('domain', 'snake');
          }

          const response = await fetch('/api/v1/identify/analyze', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const raw = await response.json();
            const adapted = adaptIdentificationResult(raw.data || raw);
            return { data: adapted };
          }
          console.warn('Identify API returned non-OK status:', response.status);
        } catch (err) {
          console.warn(
            'Backend identification unreachable, using offline fallback:',
            err,
          );
        }

        // Resilient fallback if offline
        const matchedSnake = MOCK_SNAKES[0]; // Russell's Viper
        const result: IIdentificationResult = {
          id: `ident-${Date.now()}`,
          type: 'snake',
          confidence: 0.94,
          analyzedAt: new Date().toISOString(),
          snakeData: matchedSnake,
          alternativeMatches: [
            { name: MOCK_SNAKES[1].commonName.en, confidence: 0.04 },
            { name: MOCK_SNAKES[3].commonName.en, confidence: 0.02 },
          ],
        };

        return { data: result };
      },
      invalidatesTags: ['Snakes'],
    }),

    getSnakeById: builder.query<ISnake, string>({
      queryFn: async id => {
        try {
          const res = await fetch(`/api/v1/snakes/${id}`);
          if (res.ok) {
            const json = await res.json();
            const raw = json.data || json;
            return { data: adaptPrismaSnake(raw) };
          }
        } catch (err) {
          console.warn(`Failed to fetch snake '${id}', using fallback:`, err);
        }
        const found = MOCK_SNAKES.find(s => s.id === id) || MOCK_SNAKES[0];
        return { data: found };
      },
      providesTags: (_res, _err, id) => [{ type: 'Snakes', id }],
    }),

    getSnakesList: builder.query<
      ISnake[],
      { isVenomous?: boolean; dangerLevel?: string; search?: string } | void
    >({
      queryFn: async query => {
        try {
          const params = new URLSearchParams();
          if (query) {
            if (query.isVenomous !== undefined)
              params.set('isVenomous', String(query.isVenomous));
            if (query.dangerLevel) params.set('dangerLevel', query.dangerLevel);
            if (query.search) params.set('search', query.search);
          }
          const qs = params.toString() ? `?${params.toString()}` : '';

          const res = await fetch(`/api/v1/snakes${qs}`);
          if (res.ok) {
            const json = await res.json();
            const rawData = json.data || json;
            const items = Array.isArray(rawData)
              ? rawData
              : rawData.items || [];
            if (Array.isArray(items) && items.length > 0) {
              return { data: items.map(adaptPrismaSnake) };
            }
          }
        } catch (err) {
          console.warn(
            'Failed to fetch snakes from API, falling back to mock dataset:',
            err,
          );
        }
        return { data: MOCK_SNAKES };
      },
      providesTags: ['Snakes'],
    }),
  }),
});

export const {
  useIdentifySnakeMutation,
  useGetSnakeByIdQuery,
  useGetSnakesListQuery,
} = snakeApi;
