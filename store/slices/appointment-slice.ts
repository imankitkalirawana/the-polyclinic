import { DoctorType } from '@/models/Doctor';
import { UserType } from '@/models/User';
import { CalendarDate, TimeInputValue } from '@heroui/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookAppointmentType {
  user: UserType | null;
  doctor: DoctorType | null;
  date: CalendarDate | null;
  time: TimeInputValue | null;
}

const initialState: BookAppointmentType = {
  user: null,
  doctor: null,
  date: null,
  time: null
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
    setSelectedDate: (state, { payload }: PayloadAction<CalendarDate>) => {
      state.date = payload;
    },
    setSelectedTime: (state, { payload }: PayloadAction<TimeInputValue>) => {
      state.time = payload;
    },
    removeSelectedDate: (state) => {
      state.date = null;
    },
    removeSelectedTime: (state) => {
      state.time = null;
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
  setSelectedTime,
  removeSelectedDate,
  removeSelectedTime,
  setSelectedDoctor,
  removeSelectedDoctor
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
