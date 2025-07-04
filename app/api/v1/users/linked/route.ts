import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const GET = auth(async function GET(request: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { email } = request.auth?.user;

    await connectDB();
    let user = await User.findOne({ email }).select('phone').lean();
    if (!user)
      return NextResponse.json({ message: 'User not found' }, { status: 404 });

    let users = await User.find(
      user?.phone ? { phone: user.phone } : { email }
    ).select('-password');

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
