import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB, disconnectDB } from '@/lib/db';
import Email from '@/models/Email';

export const GET = auth(async function GET(request: any, context: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const id = context.params.id;
    await connectDB();
    const email = await Email.findById(id);
    if (!email) {
      return NextResponse.json({ message: 'Email not found' }, { status: 404 });
    }
    return NextResponse.json(email);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});

export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = context.params.id;
    await connectDB();
    const email = await Email.findByIdAndDelete(id);
    if (!email) {
      return NextResponse.json({ message: 'Email not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Email deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});
