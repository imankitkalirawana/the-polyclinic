import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Service, { ServiceType } from '@/models/Service';

export const GET = async function GET(_request: any, context: any) {
  try {
    const id = context.params.id;
    await connectDB();
    const service = await Service.findById(id);
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
    data.updatedBy = request.auth.user.email;
    await connectDB();
    const service = await Service.findByIdAndUpdate(id, data, {
      new: true,
    });
    return NextResponse.json(service);
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
    const service = await Service.findByIdAndDelete(id);
    return NextResponse.json(service);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
