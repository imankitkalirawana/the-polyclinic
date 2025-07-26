import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const GET = auth(async (request: any, context: any) => {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await context.params;

    // user can only get doctors and nurses, admin can get all users, receptionist can get all users and doctors, doctors can get all patients

    // const accessMap: Record<UserType['role'], UserType['role'][]> = {
    //   admin: [],
    // };

    await connectDB();

    const users = await User.find({ role }).select('-password');

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
