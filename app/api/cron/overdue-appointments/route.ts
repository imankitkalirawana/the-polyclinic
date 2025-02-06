import { sendHTMLMail } from '@/lib/functions';
import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { AppointmentStatus } from '@/utils/email-template/patient';

export const POST = async function POST(request: any) {
  try {
    await connectDB();
    const appointments = await Appointment.find({
      date: { $lt: new Date().toISOString() },
      status: {
        $nin: ['overdue', 'cancelled', 'completed', 'on-hold', 'in-progress']
      }
    }).lean();

    for (const appointment of appointments) {
      await Appointment.findOneAndUpdate(
        { aid: appointment.aid },
        { status: 'overdue' },
        { new: true }
      ).then(async () => {
        await sendHTMLMail(
          appointment.patient.email,
          'Action Needed: Reschedule Your Missed Appointment',
          AppointmentStatus(appointment)
        );
      });
    }

    return NextResponse.json({
      message: `Affected ${appointments.length} items`,
      appointments
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
