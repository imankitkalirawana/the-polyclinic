import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB, disconnectDB } from '@/lib/db';
import Drug from '@/models/Drug';

// get drug by id from param
export async function GET(_request: any, context: any) {
  try {
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
  } finally {
    await disconnectDB();
  }
}

// update drug by id from param
export const PUT = auth(async function PUT(request: any, context: any) {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];
    // @ts-ignore
    if (request.auth?.user?.uid !== context?.params?.uid) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
    const data = await request.json();

    await connectDB();

    const did = parseInt(context.params.did);
    let drug = await Drug.findOne({ did });
    if (!drug) {
      return NextResponse.json({ message: 'Drug not found' }, { status: 404 });
    }

    drug.updatedBy = request.auth?.user?.email;

    drug = await Drug.findOneAndUpdate({ did }, data, {
      new: true,
    });
    return NextResponse.json(drug);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});

// delete drug by id from param
export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];
    // @ts-ignore
    if (request.auth?.user?.uid !== context?.params?.uid) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
    await connectDB();
    const did = parseInt(context.params.did);

    let drug = await Drug.findOne({ did });
    if (!drug) {
      return NextResponse.json({ message: 'Drug not found' }, { status: 404 });
    }

    await Drug.findOneAndDelete({ did });
    return NextResponse.json({ message: 'Drug deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});
