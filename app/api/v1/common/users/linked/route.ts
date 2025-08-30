import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/services/common/user/model';

export const GET = auth(async (request: NextAuthRequest) => {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { email } = request.auth?.user;

    const conn = await connectDB();
    const User = getUserModel(conn);

    const user = await User.findOne({ email }).select('phone').lean();
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const users = await User.find({ email }).select('-password');

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
});
