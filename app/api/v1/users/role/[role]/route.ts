import { connectDB } from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import User from '@/models/User';
import { UserType } from '@/types/user';

export const GET = auth(async function GET(request: any, context: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { role } = context.params;

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
