'use server';

import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { UserType } from '@/types/user';

// get all patients
export const getAllPatients = async () => {
  await connectDB();
  const users = await User.find({ role: 'patient' }).select('-password').lean();
  return users.map((user) => ({
    ...user,
    _id: user._id.toString(),
  }));
};

// get all patients with specific email

export const getAllPatientsWithEmail = async (email: string) => {
  await connectDB();
  const user = await User.findOne({ email }).select('phone').lean();
  if (!user) {
    throw new Error('User not found');
  }

  const users = await User.find(user?.phone ? { phone: user.phone } : { email })
    .select('-password')
    .lean();

  return users.map((user) => ({
    ...user,
    _id: user._id.toString(),
  })) as UserType[];
};
