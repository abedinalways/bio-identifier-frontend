import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: headers => {
      headers.set('X-Client-Platform', 'web-next16');

      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('bio_auth_token')
          : null;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Snakes', 'Pests', 'Antivenom', 'Emergency', 'Users', 'Auth'],
  endpoints: () => ({}),
});
