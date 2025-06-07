import { NextResponse } from 'next/server';

import { sendHTMLEmail } from '@/functions/server-actions/emails/send-email';
import { connectDB, disconnectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { AppointmentStatus } from '@/utils/email-template/patient';

export const POST = async function POST(request: any) {
  try {
    await connectDB();
    const appointments = await Appointment.find({
      date: { $lt: new Date().toISOString() },
      status: {
        $nin: ['overdue', 'cancelled', 'completed', 'on-hold', 'in-progress'],
      },
    }).lean();

    for (const appointment of appointments) {
      await Appointment.findOneAndUpdate(
        { aid: appointment.aid },
        { status: 'overdue' },
        { new: true }
      ).then(async () => {
        await sendHTMLEmail({
          to: appointment.patient.email,
          subject: 'Action Needed: Reschedule Your Missed Appointment',
          html: AppointmentStatus(appointment),
        });
      });
    }

    return NextResponse.json({
      message: `Affected ${appointments.length} items`,
      appointments,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
};
