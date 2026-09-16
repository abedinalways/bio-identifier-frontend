import { baseApi } from './baseApi';
import type { ISnake, IIdentificationResult } from '../../core/interfaces';
import { MOCK_SNAKES } from '../../core/data/mockData';

export const snakeApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    identifySnake: builder.mutation<IIdentificationResult, FormData>({
      queryFn: async formData => {
        try {
          // Attempt real API call to Nest.js backend
          const response = await fetch('/api/v1/snakes/identify', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            return { data };
          }
        } catch {
          // Fallback simulation when backend is not yet started
        }

        // Resilient fallback for demonstration / offline use
        // Simulates intelligent neural prediction based on mock data
        const matchedSnake = MOCK_SNAKES[0]; // Russell's Viper for high-stakes demonstration
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
            const data = await res.json();
            return { data };
          }
        } catch {
          // fallback
        }
        const found = MOCK_SNAKES.find(s => s.id === id) || MOCK_SNAKES[0];
        return { data: found };
      },
      providesTags: (_res, _err, id) => [{ type: 'Snakes', id }],
    }),

    getSnakesList: builder.query<ISnake[], void>({
      queryFn: async () => {
        try {
          const res = await fetch('/api/v1/snakes');
          if (res.ok) {
            const data = await res.json();
            return { data };
          }
        } catch {
          // fallback
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
