import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';
import ActivityLog from '@/models/Activity';

export const GET = auth(async function GET(request: any, context: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = context.params;

    const activity = await ActivityLog.find({
      id: Number(id),
      schema: 'appointment',
    }).sort({ createdAt: -1 });

    return NextResponse.json(activity);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
});
