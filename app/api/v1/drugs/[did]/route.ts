import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { BetterAuthRequest } from '@/types/better-auth';
import { connectDB } from '@/lib/db';
import Drug from '@/models/Drug';
import { $FixMe } from '@/types';

// get drug by id from param
export const GET = auth(async (request: BetterAuthRequest, context: $FixMe) => {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];
    if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const did = parseInt(context.params.did);
    const drug = await Drug.findOne({ did });
    if (!drug) {
      return NextResponse.json({ message: 'Drug not found' }, { status: 404 });
    }
    return NextResponse.json(drug);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

// update drug by did from param
export const PUT = auth(async (request: BetterAuthRequest, context: $FixMe) => {
  try {
    const allowedRoles = ['admin', 'laboratorist'];
    if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
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
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

// delete drug by did from param
export const DELETE = auth(async (request: BetterAuthRequest, context: $FixMe) => {
  try {
    const allowedRoles = ['admin', 'laboratorist'];
    if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const did = parseInt(context.params.did);

    const drug = await Drug.findOne({ did });
    if (!drug) {
      return NextResponse.json({ message: 'Drug not found' }, { status: 404 });
    }

    await Drug.findOneAndDelete({ did });
    return NextResponse.json({
      message: `${drug.brandName} deleted successfully`,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
