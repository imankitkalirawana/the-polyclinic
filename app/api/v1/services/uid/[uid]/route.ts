import { NextResponse } from 'next/server';

import { connectDB } from '@/lib/db';
import Service from '@/models/Service';

export const GET = async function GET(_request: any, context: any) {
  try {
    const uid = context.params.uid;
    await connectDB();
    const service = await Service.findOne({ uniqueId: uid });
    return NextResponse.json(service);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
};
