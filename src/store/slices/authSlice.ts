import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUserProfile {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'DOCTOR' | 'AGRONOMIST' | 'ADMIN';
  phone?: string | null;
}

interface AuthState {
  user: IUserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
    };
  }

  try {
    const token = localStorage.getItem('bio_auth_token');
    const userJson = localStorage.getItem('bio_auth_user');
    if (token && userJson) {
      return {
        accessToken: token,
        user: JSON.parse(userJson),
        isAuthenticated: true,
      };
    }
  } catch {
    // Ignore storage parse errors
  }

  return {
    user: null,
    accessToken: null,
    isAuthenticated: false,
  };
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: IUserProfile; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

      if (typeof window !== 'undefined') {
        localStorage.setItem('bio_auth_token', action.payload.accessToken);
        localStorage.setItem(
          'bio_auth_user',
          JSON.stringify(action.payload.user),
        );
      }
    },
    logout: state => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('bio_auth_token');
        localStorage.removeItem('bio_auth_user');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
