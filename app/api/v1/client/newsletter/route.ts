import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Newsletter from '@/models/client/Newsletter';

export const GET = auth(async (request: NextAuthRequest) => {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const newsletters = await Newsletter.find();
    return NextResponse.json(newsletters);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const POST = async function POST(request: NextAuthRequest) {
  try {
    const data = await request.json();
    const { email } = data;

    await connectDB();
    const res = await Newsletter.findOne({ email });
    if (res) {
      return NextResponse.json({ message: 'Already Subscribed' }, { status: 400 });
    }
    const newsletter = new Newsletter(data);
    await newsletter.save();
    return NextResponse.json({
      newsletter,
      message: 'Subscribed successfully',
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
};

export const DELETE = auth(async (request: NextAuthRequest) => {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const email = searchParams.get('email');
    await connectDB();
    const newsletter = await Newsletter.findOneAndDelete({ email });
    if (!newsletter) {
      return NextResponse.json({ message: 'Newsletter not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Newsletter deleted successfully' });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
