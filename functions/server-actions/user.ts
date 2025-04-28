'use server';

import { connectDB } from '@/lib/db';
import User, { UserType } from '@/models/User';

export async function getSelf({ email }: { email: string }) {
  try {
    await connectDB();
    const user = await User.findOne({ email }).select('-password').lean();
    return {
      success: true,
      user: {
        ...user,
        _id: user?._id.toString(),
      } as UserType,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      user: {} as UserType,
      message: 'Error fetching user',
    };
  }
}
