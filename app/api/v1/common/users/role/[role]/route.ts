import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/services/common/user/model';
import { $FixMe } from '@/types';
import { OrganizationUser } from '@/services/common/user';

export const GET = auth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await context.params;

    // user can only get doctors and nurses, admin can get all users, receptionist can get all users and doctors, doctors can get all patients

    // const accessMap: Record<UserType['role'], UserType['role'][]> = {
    //   admin: [],
    // };

    const conn = await connectDB();
    const User = getUserModel(conn);

    const users = await User.find({ role: role as OrganizationUser['role'] }).select('-password');

    return NextResponse.json(users);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
