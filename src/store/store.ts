import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import { uiSlice } from './slices/uiSlice';
import { preferenceSlice } from './slices/preferenceSlice';
import { authSlice } from './slices/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authSlice.reducer,
      ui: uiSlice.reducer,
      preference: preferenceSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
