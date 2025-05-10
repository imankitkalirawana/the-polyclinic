import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { API_ACTIONS } from '@/lib/config';

export const GET = auth(async function GET(request: any) {
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

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const POST = auth(async function POST(request: any) {
  try {
    const allowedRoles = ['admin', 'receptionist'];
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    const user = new User(data);
    await user.save();
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

// Delete Users
export const DELETE = auth(async function DELETE(request: any) {
  try {
    const allowedRoles = ['admin', 'receptionist'];
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { ids } = await request.json();

    !!API_ACTIONS.isDelete && (await User.deleteMany({ uid: { $in: ids } }));

    return NextResponse.json(
      { success: true, message: `${ids.length} Users deleted` },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
});
