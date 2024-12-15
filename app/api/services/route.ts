import { NextResponse } from 'next/server';
import Service, { ServiceType } from '@/models/Service';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(request: any) {
  try {
    const query: any = { status: 'active' };

    await connectDB();
    const services = await Service.find(query);
    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const POST = auth(async function POST(request: any) {
  const allowedRoles = ['admin'];
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
