import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB, disconnectDB } from '@/lib/db';
import User from '@/models/User';

export const GET = auth(async function GET(request: any) {
  try {
    await connectDB();
    const user = await User.findOne({
      email: request.auth?.user?.email,
    }).select('-password');
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  } finally {
    await disconnectDB();
  }
});
