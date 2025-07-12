import { NextResponse } from 'next/server';

import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';

export const POST = async function POST() {
  try {
    await connectDB();

    const now = new Date();

    // Step 1: Find only those appointments that are in the past AND have expected status
    const matchingAppointments = await Appointment.find(
      {
        status: { $in: ['booked', 'confirmed', 'in-progress'] },
        date: { $lt: now },
      },
      { _id: 1, status: 1, date: 1 }
    ).lean();

    // Step 2: Filter again in JS to be extra safe if date is not a true Date object
    const trulyPastAppointments = matchingAppointments.filter(
      (a) => new Date(a.date) < now
    );

    if (trulyPastAppointments.length === 0) {
      return NextResponse.json(
        {
          message: 'No overdue appointments found',
          matchedCount: 0,
          modifiedCount: 0,
          modifiedAppointments: [],
        },
        { status: 200 }
      );
    }

    // Step 3: Prepare modifiedAppointments log
    const modifiedAppointments = trulyPastAppointments.map((doc) => ({
      aid: doc._id,
      previousStatus: doc.status,
    }));

    // Step 4: Update them all
    const result = await Appointment.updateMany(
      {
        _id: { $in: trulyPastAppointments.map((doc) => doc._id) },
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
        modifiedAppointments,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating appointments:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
