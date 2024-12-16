import { NextResponse } from 'next/server';
import Drug from '@/models/Drug';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = async function GET(request: any) {
  try {
    await connectDB();
    const drugs = await Drug.find();
    return NextResponse.json(drugs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const POST = auth(async function POST(request: any) {
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

export const PUT = auth(async function PUT(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const data = await request.json();
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { message: 'Data must be an array of drugs' },
        { status: 400 }
      );
    }

    const drugs = await Drug.insertMany(data);
    return NextResponse.json(drugs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
