import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { API_ACTIONS } from '@/lib/config';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { $FixMe } from '@/types';

// get user by id from param
export const GET = auth(async function GET(request: $FixMe, context: $FixMe) {
  try {
    const allowedRoles = [
      'admin',
      'doctor',
      'receptionist',
      'nurse',
      'pharmacist',
    ];

    if (request.auth?.user?.uid !== context?.params?.uid) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
    await connectDB();
    const uid = parseInt(context.params.uid);
    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

// update user by id from param
export const PUT = auth(async function PUT(request: $FixMe, context: $FixMe) {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];
    if (request.auth?.user?.uid !== context?.params?.uid) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
    const data = await request.json();

    await connectDB();
    const uid = parseInt(context.params.uid);
    let user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    user.updatedBy = request.auth?.user?.email;
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }
    user = await User.findOneAndUpdate({ uid }, data, {
      new: true,
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

// delete user by id from param
export const DELETE = auth(async function DELETE(
  request: $FixMe,
  context: $FixMe
) {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];
    if (request.auth?.user?.uid !== context?.params?.uid) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
    await connectDB();
    const uid = parseInt(context.params.uid);

    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (API_ACTIONS.isDelete) {
      await User.findOneAndDelete({ uid });
    }
    return NextResponse.json({ message: 'User deleted' });
  } catch (error: $FixMe) {
    console.error(error);
    return NextResponse.json(
      { message: error?.message || 'An error occurred' },
      { status: 500 }
    );
  }
});
