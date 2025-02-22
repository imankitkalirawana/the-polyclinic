import { NextResponse } from 'next/server';
import Otp from '@/models/Otp';
import { connectDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id, otp } = await request.json();
    // check if otp exists
    const res = await Otp.findOne({ id, otp });
    if (!res) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 401 });
    }
    await Otp.findByIdAndDelete(res._id);
    return NextResponse.json({ message: 'Successfully Verified!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
