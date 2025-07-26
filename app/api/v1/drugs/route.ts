import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Drug from '@/models/Drug';

export const GET = auth(async (request: NextAuthRequest) => {
  try {
    const allowedRoles = ['admin', 'receptionist', 'doctor', 'user'];

    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const drugs = await Drug.find().sort({ name: 1 });

    return NextResponse.json(drugs);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const POST = auth(async (request: NextAuthRequest) => {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    const drug = new Drug(data);
    await drug.save();
    return NextResponse.json(drug);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const PUT = auth(async (request: NextAuthRequest) => {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const data = await request.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ message: 'Data must be an array of drugs' }, { status: 400 });
    }

    const drugs = await Drug.insertMany(data);
    return NextResponse.json(drugs);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
