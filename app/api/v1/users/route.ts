import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { API_ACTIONS } from '@/lib/config';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const GET = auth(async (request: NextAuthRequest) => {
  try {
    if (!request.auth?.user?.role) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let users = [];
    const role = request.auth?.user?.role;

    switch (role) {
      case 'user':
        users = await User.find({ role: 'user' }).select('-password');
        break;
      case 'admin':
        users = await User.find().select('-password');
        break;
      default:
        // get all users except admin
        users = await User.find({ role: { $ne: 'admin' } }).select('-password');
        break;
    }

    return NextResponse.json({
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const POST = auth(async (request: NextAuthRequest) => {
  try {
    const allowedRoles = ['admin', 'receptionist'];
    if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    const user = new User(data);
    await user.save();
    return NextResponse.json({
      message: 'User created successfully',
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

// Delete Users
export const DELETE = auth(async (request: NextAuthRequest) => {
  try {
    const allowedRoles = ['admin', 'receptionist'];
    if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { ids } = await request.json();

    if (API_ACTIONS.isDelete) {
      const res = await User.deleteMany({ uid: { $in: ids } });
      return NextResponse.json({
        message: `${res.deletedCount} Users deleted successfully`,
      });
    }

    return NextResponse.json({
      message: `${ids.length} Users deleted successfully`,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
