import { User } from '@/lib/interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: User = {} as User;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return action.payload;
    }
  }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
