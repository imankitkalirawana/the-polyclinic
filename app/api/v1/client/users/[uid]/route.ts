import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import bcrypt from 'bcryptjs';

import { auth } from '@/auth';
import { API_ACTIONS } from '@/lib/config';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { $FixMe } from '@/types';

// get user by id from param
export const GET = auth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    const uid = parseInt(context.params.uid);

    if (request.auth?.user?.role === 'user' && request.auth?.user?.uid !== uid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

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

export const PUT = auth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    const allowedRoles = ['admin', 'receptionist'];
    // @ts-ignore
    if (request.auth?.user?.uid !== context?.params?.uid) {
      if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }

    const data = await request.json();

    await connectDB();
    const { uid } = context.params;

    let user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    user.updatedBy = request.auth?.user?.email ?? '';
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
      console;
    }
    user = await User.findOneAndUpdate({ uid }, data, {
      new: true,
    });
    return NextResponse.json({
      message: 'User updated successfully',
      data: user,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

// delete user by id from param
export const DELETE = auth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    const allowedRoles = ['admin', 'receptionist'];
    // @ts-ignore
    if (request.auth?.user?.uid !== context?.params?.uid) {
      if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
    await connectDB();
    const uid = parseInt(context.params.uid);

    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    API_ACTIONS.isDelete && (await User.findOneAndDelete({ uid }));
    return NextResponse.json({
      message: `${user.name} was deleted successfully`,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
