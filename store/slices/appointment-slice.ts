import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DoctorType } from '@/models/Doctor';
import { UserType } from '@/models/User';

export interface AddionalInfo {
  notes?: string;
  type: 'online' | 'offline';
  symptoms?: string;
}
interface BookAppointmentType {
  user: UserType | null;
  doctor: DoctorType | null;
  date: Date | null;
  additionalInfo: AddionalInfo;
}

const initialState: BookAppointmentType = {
  user: null,
  doctor: null,
  date: null,
  additionalInfo: {
    notes: '',
    type: 'offline',
    symptoms: '',
  } as AddionalInfo,
};

const appointmentSlice = createSlice({
  name: 'book-appointment',
  initialState,
  reducers: {
    setSelectedUser: (state, { payload }: PayloadAction<UserType>) => {
      state.user = payload;
    },
    removeSelectedUser: (state) => {
      state.user = null;
    },
    setSelectedDate: (state, { payload }: PayloadAction<Date>) => {
      state.date = payload;
    },

    removeSelectedDate: (state) => {
      state.date = null;
    },
    setSelectedDoctor: (state, { payload }: PayloadAction<DoctorType>) => {
      state.doctor = payload;
    },
    removeSelectedDoctor: (state) => {
      state.doctor = null;
    },
    setAdditionalInfo: (
      state,
      { payload }: PayloadAction<Partial<AddionalInfo>>
    ) => {
      state.additionalInfo = {
        ...state.additionalInfo,
        ...payload,
      };
    },
    removeAdditionalInfo: (state) => {
      state.additionalInfo = {
        notes: '',
        type: 'offline',
        symptoms: '',
      };
    },
  },
});

export const {
  setSelectedUser,
  removeSelectedUser,
  setSelectedDate,
  removeSelectedDate,
  setSelectedDoctor,
  removeSelectedDoctor,
  setAdditionalInfo,
  removeAdditionalInfo,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
