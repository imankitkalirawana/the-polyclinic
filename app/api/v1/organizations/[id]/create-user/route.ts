import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import bcrypt from 'bcryptjs';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { getOrganizationModel } from '@/models/Organization';
import { getUserModel } from '@/models/User';

type Params = Promise<{
  id: string;
}>;

export const POST = auth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  try {
    const allowedRoles = ['superadmin', 'admin', 'ops', 'dev'];
    if (request.auth?.user && !allowedRoles.includes(request.auth.user.role)) {
      return NextResponse.json({ message: 'Forbidden: Access denied' }, { status: 403 });
    }

    const conn = await connectDB();
    const Organization = getOrganizationModel(conn);
    const { id } = await params;
    const body = await request.json();
    const { email, password, ...rest } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const conn2 = await connectDB(id);
    const User = getUserModel(conn2);
    const organization = await Organization.findOne({ organizationId: id });
    if (!organization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await User.create({
      ...rest,
      email,
      organization: id,
      password: hashedPassword,
    });
    return NextResponse.json({ message: 'User created successfully', data: user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
