import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import bcrypt from 'bcryptjs';

import { connectDB } from '@/lib/db';
import { getUserModel } from '@/models/User';
import { withAuth } from '@/middleware/withAuth';
import { validateUserInOrganization } from '@/lib/server-actions/validation';

type Params = Promise<{
  id: string;
  userId: string;
}>;

export const GET = withAuth(async (_request: NextAuthRequest, { params }: { params: Params }) => {
  const { id, userId } = await params;

  const doesUserExist = await validateUserInOrganization(id, userId);
  if (!doesUserExist) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const conn = await connectDB(id);
  const User = getUserModel(conn);
  const user = await User.findOne({ uid: userId });
  return NextResponse.json({ data: user });
});

export const PUT = withAuth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  try {
    const { id, userId } = await params;

    const doesUserExist = await validateUserInOrganization(id, userId);
    if (!doesUserExist) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const conn = await connectDB(id);
    const User = getUserModel(conn);

    const body = await request.json();
    const { email, password, ...rest } = body;

    // Hash password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { uid: userId },
      {
        ...rest,
        ...(email && { email }),
        ...(hashedPassword && { password: hashedPassword }),
        updatedBy: request.auth?.user?.email,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(
  async (_request: NextAuthRequest, { params }: { params: Params }) => {
    try {
      const { id, userId } = await params;
      const doesUserExist = await validateUserInOrganization(id, userId);
      if (!doesUserExist) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      const conn = await connectDB(id);
      const User = getUserModel(conn);
      const existingUser = await User.findOne({ uid: userId });
      if (!existingUser) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      await User.findOneAndDelete({ uid: userId });

      return NextResponse.json({
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { message: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
);
