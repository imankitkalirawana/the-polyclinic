import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Service from '@/models/client/Service';
import { $FixMe } from '@/types';
import { ServiceType } from '@/types/client/service';

export const GET = async function GET(_request: NextAuthRequest, context: $FixMe) {
  try {
    const { id } = await context.params;
    await connectDB();
    const service = await Service.findOne({ uniqueId: id });
    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({
      data: service,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
};

export const PUT = auth(async (request: NextAuthRequest, context: $FixMe) => {
  const allowedRoles = ['admin'];
  if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = context.params;
    const data: ServiceType = await request.json();
    await connectDB();
    const service = await Service.findOneAndUpdate({ uniqueId: id }, data, {
      new: true,
    });
    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
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

export const DELETE = auth(async (request: NextAuthRequest, context: $FixMe) => {
  const allowedRoles = ['admin'];
  if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = context.params;
    await connectDB();
    const service = await Service.findOneAndDelete({ uniqueId: id });
    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({
      message: `${service.name} deleted successfully`,
      data: service,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
