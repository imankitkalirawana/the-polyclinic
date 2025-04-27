import { NextResponse } from 'next/server';

import { connectDB } from '@/lib/db';
import { sendOTP } from '@/lib/functions';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id } = data;
    if (!id) {
      return NextResponse.json(
        { message: 'Please provide all fields' },
        { status: 400 }
      );
    }
    await connectDB();
    const user = await User.findOne({
      $or: [{ email: id }, { phone: id }],
    });
    if (user) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }
    await sendOTP(id);
    return NextResponse.json({ message: 'OTP sent' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
