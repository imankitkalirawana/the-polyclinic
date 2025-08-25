import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { API_ACTIONS } from '@/lib/config';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { UserType } from '@/types/system/control-plane';

export const GET = auth(async (req: NextAuthRequest) => {
  try {
    if (!req.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const email = req.auth.user.email;
    const role = req.auth.user.role;

    const ALLOWED_ROLES = ['admin', 'receptionist', 'user'];

    type UserRoleType = Extract<UserType['role'], 'admin' | 'receptionist' | 'user'>;

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const queryMap: Record<UserRoleType, Record<string, unknown>> = {
      admin: {},
      receptionist: {
        $or: [{ role: 'user' }, { role: 'receptionist' }, { role: 'doctor' }],
      },
      user: {
        email,
        role: 'user',
      },
    };

    const patients = await User.find(queryMap[role as UserRoleType]).select('-password');

    return NextResponse.json({
      message: 'Patients fetched successfully',
      data: patients,
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
