import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/models/User';
import { withAuth } from '@/middleware/withAuth';
import { validateOrganizationId } from '@/lib/server-actions/validation';

type Params = Promise<{
  id: string;
}>;

export const GET = withAuth(async (_request: NextAuthRequest, { params }: { params: Params }) => {
  const { id } = await params;
  const doesOrganizationExist = await validateOrganizationId(id);
  if (!doesOrganizationExist) {
    return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
  }

  const conn = await connectDB(id);
  const User = getUserModel(conn);
  const users = await User.find({ organization: id });
  return NextResponse.json({ data: users });
});

export const POST = withAuth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const { email, password, ...rest } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const doesOrganizationExist = await validateOrganizationId(id);
    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const conn = await connectDB(id);
    const User = getUserModel(conn);

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
