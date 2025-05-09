import { connectDB } from '@/lib/db';

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import User, { UserRole } from '@/models/User';

export const GET = auth(async function GET(request: any, context: any) {
  try {
    const allowedRoles: UserRole[] = [
      UserRole.admin,
      UserRole.receptionist,
      UserRole.doctor,
      UserRole.nurse,
      UserRole.pharmacist,
    ];

    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { role } = context.params;

    await connectDB();

    const users = await User.find({ role }).select('-password');

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
