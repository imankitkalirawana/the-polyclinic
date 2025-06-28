import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Drug from '@/models/Drug';

// get drug by id from param
export const GET = auth(async function GET(request: any, context: any) {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const did = parseInt(context.params.did);
    const drug = await Drug.findOne({ did });
    if (!drug) {
      return NextResponse.json({ message: 'Drug not found' }, { status: 404 });
    }
    return NextResponse.json(drug);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

// update drug by did from param
export const PUT = auth(async function PUT(request: any, context: any) {
  try {
    const allowedRoles = ['admin', 'laboratorist'];
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    await connectDB();

    const did = parseInt(context.params.did);

    const drug = await Drug.findOneAndUpdate({ did }, data, {
      new: true,
    });

    if (drug) {
      return NextResponse.json({
        message: `${drug.brandName} updated successfully`,
        data: drug,
      });
    }

    return NextResponse.json({ message: 'Drug not found' }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

// delete drug by did from param
export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    const allowedRoles = ['admin', 'laboratorist'];
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const did = parseInt(context.params.did);

    let drug = await Drug.findOne({ did });
    if (!drug) {
      return NextResponse.json({ message: 'Drug not found' }, { status: 404 });
    }

    await Drug.findOneAndDelete({ did });
    return NextResponse.json({
      message: `${drug.brandName} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
