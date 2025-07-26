import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Drug from '@/models/Drug';

export const GET = auth(async (request: any) => {
  try {
    const allowedRoles = ['admin', 'receptionist', 'doctor', 'user'];

    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const drugs = await Drug.find().sort({ name: 1 });

    return NextResponse.json(drugs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const POST = auth(async (request: any) => {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    const drug = new Drug(data);
    await drug.save();
    return NextResponse.json(drug);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const PUT = auth(async (request: any) => {
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
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
