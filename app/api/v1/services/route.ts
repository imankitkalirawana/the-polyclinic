import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB, disconnectDB } from '@/lib/db';
import Service, { ServiceType } from '@/models/Service';
import { UserRole } from '@/models/User';

export const GET = auth(async function GET(request: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const services = await Service.find().select('-description -summary -data');

    return NextResponse.json(services);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});

export const POST = auth(async function POST(request: any) {
  const allowedRoles: UserRole[] = [UserRole.admin];
  if (!allowedRoles.includes(request.auth?.user?.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    let data: ServiceType = await request.json();
    data.createdBy = request.auth.user.email;
    await connectDB();
    if (await Service.exists({ uniqueId: data.uniqueId })) {
      return NextResponse.json(
        { message: 'Unique ID already exists' },
        { status: 400 }
      );
    }
    const service = await Service.create(data);
    return NextResponse.json(service);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});

export const DELETE = auth(async function DELETE(request: any) {
  const allowedRoles: UserRole[] = [UserRole.admin];
  if (!allowedRoles.includes(request.auth?.user?.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ids } = await request.json();
    await connectDB();
    await Service.deleteMany({ uniqueId: { $in: ids } });
    return NextResponse.json({ message: 'Services deleted' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});
