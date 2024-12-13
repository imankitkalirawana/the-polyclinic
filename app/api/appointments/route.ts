import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET() {
  try {
    await connectDB();
    const appointments = await Appointment.find();
    return NextResponse.json(appointments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const POST = auth(async function POST(request: any) {
  try {
    await connectDB();
    const data = await request.json();

    const appointment = new Appointment(data);
    await appointment.save();
    return NextResponse.json(appointment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
