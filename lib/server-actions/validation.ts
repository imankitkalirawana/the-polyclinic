'use server';

import User from '@/models/User';

export const validateEmail = async (email: string) => {
  const user = await User.findOne({ email });
  return !!user;
};
