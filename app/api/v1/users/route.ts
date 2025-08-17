import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { BetterAuthRequest } from '@/types/better-auth';
import { API_ACTIONS } from '@/lib/config';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { UserType } from '@/types/user';

export const GET = async (req: Request) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    if (!req.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email;
    const role = session.user.role;

    const ALLOWED_ROLES = ['admin', 'receptionist', 'patient'];

    type UserRoleType = Extract<UserType['role'], 'admin' | 'receptionist' | 'patient'>;

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const queryMap: Record<UserRoleType, Record<string, unknown>> = {
      admin: {},
      receptionist: {
        $or: [{ role: 'patient' }, { role: 'receptionist' }, { role: 'doctor' }],
      },
      patient: {
        email,
        role: 'patient',
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
};

export const POST = auth(async (request: BetterAuthRequest) => {
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
export const DELETE = auth(async (request: BetterAuthRequest) => {
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
