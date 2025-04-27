import { configureStore } from '@reduxjs/toolkit';

import appointmentReducer from './slices/appointment-slice';
import userReducer from './slices/user-slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    appointment: appointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
