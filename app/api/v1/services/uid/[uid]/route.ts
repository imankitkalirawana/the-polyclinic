import { NextResponse } from 'next/server';
import { connectDB, disconnectDB } from '@/lib/db';
import Service from '@/models/Service';
import { auth } from '@/auth';
import { UserRole } from '@/models/User';

export const GET = auth(async function GET(request: any, context: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const uid = context.params.uid;
    await connectDB();
    const service = await Service.findOne({ uniqueId: uid });
    return NextResponse.json(service);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});

export const PATCH = auth(async function PATCH(request: any, context: any) {
  try {
    const allowedRoles: UserRole[] = [UserRole.admin];
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const uid = context.params.uid;
    await connectDB();
    const service = await Service.findOne({ uniqueId: uid });
    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    await service.updateOne(data);
    return NextResponse.json(service);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});

export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    const allowedRoles: UserRole[] = [UserRole.admin];
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const uid = context.params.uid;
    await connectDB();
    await Service.deleteOne({ uniqueId: uid });
    return NextResponse.json({ message: 'Service deleted' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});
