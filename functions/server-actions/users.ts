'use server';

import User, { UserType } from '@/models/User';
import { connectDB } from '@/lib/db';

// get all patients
export const getAllPatients = async () => {
  await connectDB();
  const users = await User.find({ role: 'user' }).select('-password').lean();
  return users.map((user) => ({
    ...user,
    _id: user._id.toString()
  }));
};

// get all patients with specific email

export const getAllPatientsWithEmail = async (email: string) => {
  await connectDB();
  let user = await User.findOne({ email }).select('phone').lean();
  if (!user) {
    throw new Error('User not found');
  }

  let users = await User.find(user?.phone ? { phone: user.phone } : { email })
    .select('-password')
    .lean();

  return users.map((user) => ({
    ...user,
    _id: user._id.toString()
  })) as UserType[];
};

// get patient with UID

export const getPatientWithUID = async (uid: number) => {
  await connectDB();
  const user = await User.findOne({
    uid
  }).lean();
  if (!user) {
    throw new Error('User not found');
  }
  return {
    ...user,
    _id: user?._id.toString()
  };
};
