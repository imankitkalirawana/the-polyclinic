import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const GET = auth(async function GET(request: any) {
  try {
    await connectDB();
    const user = await User.findOne({
      email: request.auth?.user?.email,
    }).select('-password');

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
