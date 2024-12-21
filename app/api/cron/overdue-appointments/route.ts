import { sendHTMLMail } from '@/lib/functions';
import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { format } from 'date-fns';
import { AppointmentStatus } from '@/utils/email-template';
import { getDoctorWithUID } from '@/functions/server-actions';

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
        await getDoctorWithUID(appointment.doctor)
          .then(async (doctor) => {
            await sendHTMLMail(
              appointment.email,
              'Action Needed: Reschedule Your Missed Appointment',
              AppointmentStatus(appointment, `${doctor.name} (#${doctor.uid})`)
            ).catch((error) => {
              console.error(error);
            });
          })
          .catch((error) => {
            console.error(error);
          });
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
