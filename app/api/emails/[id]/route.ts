import { NextResponse } from 'next/server';
import Email from '@/models/Email';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

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
  }
});
