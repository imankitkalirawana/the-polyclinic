import { DoctorType } from '@/models/Doctor';
import { UserType } from '@/models/User';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookAppointmentType {
  user: UserType | null;
  doctor: DoctorType | null;
  date: Date | null;
}

const initialState: BookAppointmentType = {
  user: null,
  doctor: null,
  date: null
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
    }
  }
});

export const {
  setSelectedUser,
  removeSelectedUser,
  setSelectedDate,
  removeSelectedDate,
  setSelectedDoctor,
  removeSelectedDoctor
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
