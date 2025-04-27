import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';

export const GET = auth(async function GET(request: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await request.auth?.user?.uid;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    const statusMap: Record<string, string[]> = {
      upcoming: ['booked', 'in-progress', 'confirmed'],
      overdue: ['overdue', 'on-hold'],
      past: ['completed', 'cancelled'],
      all: [
        'booked',
        'in-progress',
        'confirmed',
        'completed',
        'cancelled',
        'overdue',
        'on-hold',
      ],
    };

    await connectDB();
    const appointments = await Appointment.find({
      doctor,
      status: statusMap[status],
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
