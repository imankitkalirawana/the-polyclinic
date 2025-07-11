import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import User from '@/models/User';

export const GET = auth(async function GET(request: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const doctors = await Doctor.find();

    console.log(doctors);

    return NextResponse.json({
      message: 'Doctors fetched successfully',
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
