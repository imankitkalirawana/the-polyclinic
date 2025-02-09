import { NextResponse } from 'next/server';
import UserConfigSchema from '@/models/UserConfig';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(request: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userConfig = await UserConfigSchema.findOne({
      uid: request.auth?.user?.uid
    });
    return NextResponse.json(userConfig);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

// create new config

export const POST = auth(async function POST(request: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { uid, config } = await request.json();

    await connectDB();
    const userConfig = await UserConfigSchema.create({ uid, config });
    return NextResponse.json(userConfig);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
