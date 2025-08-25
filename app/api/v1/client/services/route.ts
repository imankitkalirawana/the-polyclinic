import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Service from '@/models/client/Service';
import { ServiceType } from '@/types/service';

export const GET = auth(async (request: NextAuthRequest) => {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const services = await Service.find().select('-description -summary -data');

    return NextResponse.json(services);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const POST = auth(async (request: NextAuthRequest) => {
  const allowedRoles = ['admin'];
  if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data: ServiceType = await request.json();
    data.createdBy = request.auth?.user?.email ?? '';
    await connectDB();
    if (await Service.exists({ uniqueId: data.uniqueId })) {
      return NextResponse.json({ message: 'Unique ID already exists' }, { status: 400 });
    }
    const service = await Service.create(data);
    return NextResponse.json(service);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const DELETE = auth(async (request: NextAuthRequest) => {
  const allowedRoles = ['admin'];
  if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ids } = await request.json();
    await connectDB();
    await Service.deleteMany({ uniqueId: { $in: ids } });
    return NextResponse.json({ message: 'Services deleted' }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
