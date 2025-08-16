import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import User from '@/models/User';
import { auth } from '@/auth';
import { UserType } from '@/types/user';
import { connectDB } from '@/lib/db';

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
      admin: {
        role: 'user',
        status: { $in: ['active', 'unverified'] },
      },
      receptionist: {
        role: 'user',
        status: { $in: ['active', 'unverified'] },
      },
      user: {
        email,
        role: 'user',
        status: { $in: ['active', 'unverified'] },
      },
    };

    await connectDB();
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
