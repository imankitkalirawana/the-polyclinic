import { AppointmentType } from '@/models/Appointment';
import { DoctorType } from '@/models/Doctor';
import { UserType } from '@/models/User';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppointmentWithUserAndDoctor extends AppointmentType {
  doctorData: DoctorType;
  user: UserType;
}

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {} as AppointmentWithUserAndDoctor,
  reducers: {
    setAppointment(state, action: PayloadAction<AppointmentWithUserAndDoctor>) {
      return action.payload;
    },
    clearAppointment(state) {
      return {} as AppointmentWithUserAndDoctor;
    },
    updateAppointment(state, action: PayloadAction<Partial<AppointmentType>>) {
      console.log('action.payload', action.payload);
      return { ...state, ...action.payload };
    }
  }
});

export const { setAppointment, clearAppointment, updateAppointment } =
  appointmentSlice.actions;

export default appointmentSlice.reducer;
