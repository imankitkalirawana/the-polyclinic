import { NextResponse } from 'next/server';
import User, { UserRole, UserStatus } from '@/models/User';
import Doctor from '@/models/Doctor';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(request: any) {
  try {
    await connectDB();
    const doctors = await Doctor.find();
    return NextResponse.json(doctors);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const POST = auth(async function POST(request: any) {
  try {
    const allowedRoles = ['admin'];
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    let data = await request.json();

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    if (!uid) {
      return NextResponse.json({ message: 'uid is required' }, { status: 400 });
    }

    const user = await User.findOne({ uid }).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // check if uid alreaady exists
    const doctorExists = await Doctor.findOne({
      uid
    });

    if (user.role === 'doctor' || doctorExists) {
      return NextResponse.json(
        { message: 'User is already a doctor' },
        { status: 400 }
      );
    }

    user.role = 'doctor' as UserRole;
    user.status = 'active' as UserStatus;

    let doctor = new Doctor(data);

    doctor.uid = user.uid;
    doctor.email = user.email;
    doctor.phone = user.phone;
    doctor.name = user.name;

    await doctor.save();
    await user.save();

    return NextResponse.json({
      doctor,
      user,
      message: 'Doctor created successfully'
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
