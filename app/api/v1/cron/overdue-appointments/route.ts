import { NextResponse } from 'next/server';

import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';

export const POST = async function POST() {
  try {
    await connectDB();

    const now = new Date();

    const result = await Appointment.updateMany(
      {
        status: { $in: ['booked', 'confirmed', 'in-progress'] },
        date: { $lt: now },
      },
      {
        $set: { status: 'overdue' },
      }
    );

    return NextResponse.json(
      {
        message: 'Appointments updated successfully',
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating appointments:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
