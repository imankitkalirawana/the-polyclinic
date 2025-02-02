// appointment-slice.ts
import { UserType } from '@/models/User';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookAppointmentType {
  user: UserType | null; // Allow null for initial state
  doctor: UserType | null;
  date: string;
  time: string;
}

const initialState: BookAppointmentType = {
  user: null,
  doctor: null,
  date: '',
  time: ''
};

const appointmentSlice = createSlice({
  name: 'book-appointment',
  initialState,
  reducers: {
    bookAppointment(state, action: PayloadAction<BookAppointmentType>) {
      state = action.payload;
    },
    updateAppointment(
      state,
      action: PayloadAction<Partial<BookAppointmentType>>
    ) {
      return { ...state, ...action.payload };
    },
    setSelectedUser(state, action: PayloadAction<UserType>) {
      state.user = action.payload; // Update the user in the state
    }
  }
});

export const { bookAppointment, updateAppointment, setSelectedUser } =
  appointmentSlice.actions;

export default appointmentSlice.reducer;
