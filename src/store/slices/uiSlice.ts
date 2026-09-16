import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  activePortal: 'snake' | 'pest';
  isCameraOpen: boolean;
  isEmergencyModalOpen: boolean;
  isMobileNavOpen: boolean;
}

const initialState: UIState = {
  activePortal: 'snake',
  isCameraOpen: false,
  isEmergencyModalOpen: false,
  isMobileNavOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActivePortal: (state, action: PayloadAction<'snake' | 'pest'>) => {
      state.activePortal = action.payload;
    },
    setCameraOpen: (state, action: PayloadAction<boolean>) => {
      state.isCameraOpen = action.payload;
    },
    setEmergencyModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEmergencyModalOpen = action.payload;
    },
    setMobileNavOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileNavOpen = action.payload;
    },
  },
});

export const {
  setActivePortal,
  setCameraOpen,
  setEmergencyModalOpen,
  setMobileNavOpen,
} = uiSlice.actions;
