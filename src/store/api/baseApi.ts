import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: headers => {
      // You can append auth tokens or custom device headers here
      headers.set('X-Client-Platform', 'web-next16');
      return headers;
    },
  }),
  tagTypes: ['Snakes', 'Pests', 'Antivenom', 'Emergency'],
  endpoints: () => ({}),
});
