import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Otp from '@/models/Otp';

export const PATCH = async (request: any) => {
  try {
    await connectDB();
    const { email, password, otp } = await request.json();
    if (!email || !password || !otp) {
      return NextResponse.json(
        { message: 'Email, password and otp are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const otpData = await Otp.findOne({ id: email });
    if (!otpData) {
      return NextResponse.json({ message: 'Otp not found' }, { status: 404 });
    }

    if (otpData.otp !== otp) {
      return NextResponse.json({ message: 'Invalid otp' }, { status: 400 });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await Otp.deleteOne({ id: email });

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
};
