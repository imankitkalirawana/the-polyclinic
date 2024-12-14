import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(request: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const doctor = await request.auth?.user?.uid;
    await connectDB();
    const appointments = await Appointment.find({ doctor });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
