import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user-slice';
import appointmentReducer from './slices/appointment-slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    appointment: appointmentReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
