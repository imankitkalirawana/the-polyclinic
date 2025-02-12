import { NextResponse } from 'next/server';
import Newsletter from '@/models/Newsletter';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const newsletters = await Newsletter.find();
    return NextResponse.json(newsletters);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const POST = async function POST(request: any) {
  try {
    const data = await request.json();
    const { email } = data;

    await connectDB();
    const res = await Newsletter.findOne({ email });
    if (res) {
      return NextResponse.json(
        { message: 'Already Subscribed' },
        { status: 400 }
      );
    }
    const newsletter = new Newsletter(data);
    await newsletter.save();
    return NextResponse.json({
      newsletter,
      message: 'Subscribed successfully'
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const DELETE = auth(async function DELETE(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const email = searchParams.get('email');
    console.log('email', email);
    await connectDB();
    const newsletter = await Newsletter.findOneAndDelete({ email: email });
    if (!newsletter) {
      return NextResponse.json(
        { message: 'Newsletter not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Newsletter deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
