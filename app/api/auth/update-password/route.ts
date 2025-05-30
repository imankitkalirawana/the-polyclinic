import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const PATCH = auth(async function PATCH(request: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { email, password, currentPassword } = await request.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (request.auth?.user?.role !== 'admin' && !isPasswordCorrect) {
      return NextResponse.json(
        { message: 'Incorrect password' },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    await user.save();
    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
});
