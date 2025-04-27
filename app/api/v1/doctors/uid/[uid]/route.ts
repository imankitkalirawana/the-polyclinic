import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import User, { UserRole } from '@/models/User';

export const GET = auth(async function GET(request: any, context: any) {
  try {
    const uid = context.params.uid;
    await connectDB();

    const user = await User.findOne({ uid }).select('-password');
    const doctor = await Doctor.findOne({ uid });

    if (!user || !doctor) {
      return NextResponse.json(
        { message: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user, doctor });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const PUT = auth(async function PUT(request: any, context: any) {
  try {
    const allowedRoles = ['admin'];
    // @ts-ignore
    if (request.auth?.user?.id !== context?.params?.id) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }

    const uid = context.params.uid;
    await connectDB();
    let data = await request.json();

    let user = await User.findOne({ uid }).select('-password');
    let doctor = await Doctor.findOne({ uid });
    if (!user || !doctor) {
      return NextResponse.json(
        { message: 'Doctor not found' },
        { status: 404 }
      );
    }

    user.updatedBy = request.auth?.user?.email;
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }

    user = await User.findOneAndUpdate({ uid }, data);
    doctor = await Doctor.findOneAndUpdate({ uid }, data);

    return NextResponse.json({ user, doctor });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    const allowedRoles = ['admin'];
    // @ts-ignore
    if (request.auth?.user?.id !== context?.params?.id) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }

    const uid = context.params.uid;
    const { searchParams } = new URL(request.url);
    const removeOnly = searchParams.get('removeOnly') === 'true';
    await connectDB();

    const user = await User.findOne({ uid }).select('-password');
    const doctor = await Doctor.findOne({ uid });
    if (removeOnly) {
      if (!user || !doctor) {
        return NextResponse.json(
          { message: 'Doctor not found' },
          { status: 404 }
        );
      }
      user.role = 'user' as UserRole;

      await user.save();
      await Doctor.findOneAndDelete({ uid });
    } else {
      await User.findOneAndDelete({ uid });
      await Doctor.findOneAndDelete({ uid });
    }

    return NextResponse.json({ message: 'Doctor deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
