import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserType } from '@/models/User';

const initialState: UserType = {} as UserType;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserType>) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
