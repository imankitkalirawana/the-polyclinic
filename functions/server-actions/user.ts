'use server';

import User from '@/models/User';
import { connectDB } from '@/lib/db';

export const getAllPatientsWithEmail = async (email: string) => {
  await connectDB();
  //   first get the phone number of the user
  let user = await User.findOne({ email }).select('phone').lean();
  // then get all the users with the same phone number

  let users = await User.find({ phone: user?.phone })
    .select('-password')
    .lean();

  return users.map((user) => ({
    ...user,
    _id: user._id.toString()
  }));
};
