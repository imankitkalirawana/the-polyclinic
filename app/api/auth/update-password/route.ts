import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id, password } = await request.json();
    const user = await User.findOne({ $or: [{ email: id }, { phone: id }] });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    await user.save();
    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
