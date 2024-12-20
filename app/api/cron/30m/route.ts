import { sendHTMLMail } from '@/lib/functions';
import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { format } from 'date-fns';
import { OverdueEmail } from '@/utils/email-template/overdue-email';
import { checkDomainMx, transporter } from '@/lib/nodemailer';

export const POST = async function POST(request: any) {
  try {
    await connectDB();
    const appointments = await Appointment.find({
      date: { $lt: new Date().toISOString() },
      status: { $nin: ['overdue', 'cancelled', 'completed'] }
    }).lean();

    for (const appointment of appointments) {
      await Appointment.findOneAndUpdate(
        { aid: appointment.aid },
        {},
        { new: true }
      ).then(async () => {
        await checkDomainMx('contact@divinely.dev')
          .then(async () => {
            await sendHTMLMail(
              appointment.email,
              'Action Needed: Reschedule Your Missed Appointment',
              OverdueEmail(
                appointment.aid,
                appointment.name,
                format(appointment.date, 'PPPPp')
              )
            );
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
