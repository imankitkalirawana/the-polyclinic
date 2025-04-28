import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

// get user by id from param
export const GET = auth(async function GET(request: any, context: any) {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];

    // @ts-ignore
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    await connectDB();
    const uid = parseInt(context.params.uid);
    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
});

// update user by id from param
export const PUT = auth(async function PUT(request: any, context: any) {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];
    // @ts-ignore
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
      console;
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
export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];
    // @ts-ignore
    if (request.auth?.user?.uid !== context?.params?.uid) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
    await connectDB();
    const uid = parseInt(context.params.uid);

    let user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await User.findOneAndDelete({ uid });
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
