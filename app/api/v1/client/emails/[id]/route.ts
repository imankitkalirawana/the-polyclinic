import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Email from '@/models/client/Email';
import { $FixMe } from '@/types';

export const GET = auth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { id } = context.params;
    await connectDB();
    const email = await Email.findById(id);
    if (!email) {
      return NextResponse.json({ message: 'Email not found' }, { status: 404 });
    }
    return NextResponse.json(email);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const DELETE = auth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = context.params;
    await connectDB();
    const email = await Email.findByIdAndDelete(id);
    if (!email) {
      return NextResponse.json({ message: 'Email not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Email deleted successfully' });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
