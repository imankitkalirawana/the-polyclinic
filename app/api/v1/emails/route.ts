import { NextResponse } from 'next/server';
import Email from '@/models/Email';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const emails = await Email.find();
    return NextResponse.json(emails);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const POST = async function POST(request: any) {
  try {
    const data = await request.json();

    await connectDB();
    const email = new Email(data);
    await email.save();
    return NextResponse.json({
      email,
      message: 'Email sent successfully'
    });

    await connectDB();
    // const res =
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
