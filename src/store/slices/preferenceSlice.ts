import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CropType } from '../../core/types';

export interface PreferenceState {
  selectedRegion: string;
  selectedCrop: CropType;
  sprayerTankSize: number;
}

const initialState: PreferenceState = {
  selectedRegion: 'Bangladesh (General)',
  selectedCrop: 'mango',
  sprayerTankSize: 16, // Default 16L standard knapsack sprayer
};

export const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    setSelectedRegion: (state, action: PayloadAction<string>) => {
      state.selectedRegion = action.payload;
    },
    setSelectedCrop: (state, action: PayloadAction<CropType>) => {
      state.selectedCrop = action.payload;
    },
    setSprayerTankSize: (state, action: PayloadAction<number>) => {
      state.sprayerTankSize = action.payload;
    },
  },
});

export const { setSelectedRegion, setSelectedCrop, setSprayerTankSize } =
  preferenceSlice.actions;
