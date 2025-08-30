import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import { auth } from '@/auth';
import { API_ACTIONS } from '@/lib/config';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/models/User';
import { $FixMe } from '@/types';

type Params = Promise<{
  uid: string;
}>;

// get user by id from param
export const GET = auth(async (request: $FixMe, { params }: { params: Params }) => {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist', 'nurse', 'pharmacist'];

    if (request.auth?.user?.uid !== (await params).uid) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
    const conn = await connectDB();
    const User = getUserModel(conn);
    const uid = parseInt((await params).uid);
    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

// update user by id from param
export const PUT = auth(async (request: $FixMe, { params }: { params: Params }) => {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];
    if (request.auth?.user?.uid !== (await params).uid) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
    const data = await request.json();

    const conn = await connectDB();
    const User = getUserModel(conn);
    const uid = parseInt((await params).uid);
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
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

// delete user by id from param
export const DELETE = auth(async (request: $FixMe, { params }: { params: Params }) => {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];
    if (request.auth?.user?.uid !== (await params).uid) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
    const conn = await connectDB();
    const User = getUserModel(conn);
    const uid = parseInt((await params).uid);

    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (API_ACTIONS.isDelete) {
      await User.findOneAndDelete({ uid });
    }
    return NextResponse.json({ message: 'User deleted' });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
