import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Service from '@/models/Service';
import { ServiceType } from '@/types/service';

export const GET = async function GET(_request: any, context: any) {
  try {
    const id = context.params.id;
    await connectDB();
    const service = await Service.findOne({ uniqueId: id });
    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
};

export const PUT = auth(async function PUT(request: any, context: any) {
  const allowedRoles = ['admin'];
  if (!allowedRoles.includes(request.auth?.user?.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = context.params.id;
    let data: ServiceType = await request.json();
    await connectDB();
    const service = await Service.findOneAndUpdate({ uniqueId: id }, data, {
      new: true,
    });
    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: `${service.name} updated successfully`,
      data: service,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(request: any, context: any) {
  const allowedRoles = ['admin'];
  if (!allowedRoles.includes(request.auth?.user?.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = context.params.id;
    await connectDB();
    const service = await Service.findOneAndDelete({ uniqueId: id });
    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: `${service.name} deleted successfully`,
      data: service,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
