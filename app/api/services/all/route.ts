import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Service from '@/models/Service';

export const GET = auth(async function GET(request: any) {
  try {
    await connectDB();
    const services = await Service.find();
    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
