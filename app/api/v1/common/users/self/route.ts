import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/services/common/user/model';

export const GET = auth(async (request: NextAuthRequest) => {
  try {
    const conn = await connectDB();
    const User = getUserModel(conn);
    const user = await User.findOne({
      email: request.auth?.email,
    }).select('-password');

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
});
