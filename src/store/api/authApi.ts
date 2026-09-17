import { baseApi } from './baseApi';
import type { IUserProfile } from '../slices/authSlice';

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  user: IUserProfile;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<ILoginResponse, ILoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any) => {
        return response.data || response;
      },
      invalidatesTags: ['Auth'],
    }),

    getProfile: builder.query<IUserProfile, void>({
      query: () => '/auth/me',
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery } = authApi;
