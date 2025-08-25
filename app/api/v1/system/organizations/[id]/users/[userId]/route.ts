import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import bcrypt from 'bcryptjs';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { getOrganizationModel } from '@/models/system/Organization';
import { getUserModel } from '@/models/User';
import { doesEmailExist } from '@/functions/server-actions/validations';

type Params = Promise<{
  id: string;
  userId: string;
}>;

// PUT - Update user
export const PUT = auth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  try {
    const allowedRoles = ['superadmin', 'admin', 'ops', 'dev'];
    if (request.auth?.user && !allowedRoles.includes(request.auth.user.role)) {
      return NextResponse.json({ message: 'Forbidden: Access denied' }, { status: 403 });
    }

    // Connect to the main database
    const conn = await connectDB();
    const Organization = getOrganizationModel(conn);
    const { id, userId } = await params;

    // Check if organization exists
    const organization = await Organization.findOne({ organizationId: id });
    if (!organization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    // Connect to the organization database
    const conn2 = await connectDB(id);
    const User = getUserModel(conn2);

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { email, password, ...rest } = body;

    // If email is being updated, check for uniqueness
    if (email && email !== existingUser.email) {
      const emailExists = await doesEmailExist({
        email,
        organizationId: id,
        currentEmail: existingUser.email,
      });
      if (emailExists) {
        return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
      }
    }

    // Hash password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
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

// DELETE - Delete user
export const DELETE = auth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  try {
    const allowedRoles = ['superadmin', 'admin', 'ops', 'dev'];
    if (request.auth?.user && !allowedRoles.includes(request.auth.user.role)) {
      return NextResponse.json({ message: 'Forbidden: Access denied' }, { status: 403 });
    }

    const conn = await connectDB();
    const Organization = getOrganizationModel(conn);
    const { id, userId } = await params;

    // Check if organization exists
    const organization = await Organization.findOne({ organizationId: id });
    if (!organization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const conn2 = await connectDB(id);
    const User = getUserModel(conn2);

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

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
});
