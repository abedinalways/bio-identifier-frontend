import { baseApi } from './baseApi';
import type { ISnake, IPest, IEmergencyHospital } from '../../core/interfaces';

export interface ISosLog {
  id: string;
  callerPhone?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  hospitalId?: string;
  hospital?: {
    name: string;
    hotline: string;
    district: string;
  };
  userId?: string;
  user?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface IAdminUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'USER' | 'DOCTOR' | 'AGRONOMIST' | 'ADMIN';
  createdAt: string;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // ----------------------------------------------------
    // Snakes Management
    // ----------------------------------------------------
    createSnake: builder.mutation<ISnake, any>({
      query: snakeData => ({
        url: '/snakes',
        method: 'POST',
        body: snakeData,
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['Snakes'],
    }),

    updateSnake: builder.mutation<ISnake, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/snakes/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['Snakes'],
    }),

    deleteSnake: builder.mutation<{ success: boolean }, string>({
      query: id => ({
        url: `/snakes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Snakes'],
    }),

    // ----------------------------------------------------
    // Pests Management
    // ----------------------------------------------------
    createPest: builder.mutation<IPest, any>({
      query: pestData => ({
        url: '/pests',
        method: 'POST',
        body: pestData,
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['Pests'],
    }),

    updatePest: builder.mutation<IPest, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/pests/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['Pests'],
    }),

    deletePest: builder.mutation<{ success: boolean }, string>({
      query: id => ({
        url: `/pests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Pests'],
    }),

    // ----------------------------------------------------
    // Hospitals Management
    // ----------------------------------------------------
    createHospital: builder.mutation<IEmergencyHospital, any>({
      query: hospitalData => ({
        url: '/hospitals',
        method: 'POST',
        body: hospitalData,
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['Emergency'],
    }),

    updateHospital: builder.mutation<
      IEmergencyHospital,
      { id: string; data: any }
    >({
      query: ({ id, data }) => ({
        url: `/hospitals/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['Emergency'],
    }),

    deleteHospital: builder.mutation<{ success: boolean }, string>({
      query: id => ({
        url: `/hospitals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Emergency'],
    }),

    // ----------------------------------------------------
    // Emergency SOS Logs
    // ----------------------------------------------------
    getEmergencyLogs: builder.query<ISosLog[], void>({
      query: () => '/emergency/logs',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['Emergency'],
    }),

    // ----------------------------------------------------
    // Users Administration
    // ----------------------------------------------------
    getUsersList: builder.query<IAdminUser[], void>({
      query: () => '/users',
      transformResponse: (response: any) => {
        const payload = response.data || response;
        return Array.isArray(payload) ? payload : payload.items || [];
      },
      providesTags: ['Users'],
    }),

    updateUserRole: builder.mutation<
      IAdminUser,
      { id: string; role: 'USER' | 'DOCTOR' | 'AGRONOMIST' | 'ADMIN' }
    >({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      transformResponse: (response: any) => response.data || response,
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useCreateSnakeMutation,
  useUpdateSnakeMutation,
  useDeleteSnakeMutation,
  useCreatePestMutation,
  useUpdatePestMutation,
  useDeletePestMutation,
  useCreateHospitalMutation,
  useUpdateHospitalMutation,
  useDeleteHospitalMutation,
  useGetEmergencyLogsQuery,
  useGetUsersListQuery,
  useUpdateUserRoleMutation,
} = adminApi;
