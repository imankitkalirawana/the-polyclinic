import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';
import { sendHTMLEmail } from '@/functions/server-actions/emails/send-email';
import { RescheduledAppointment } from '@/utils/email-template/patient';
import { format } from 'date-fns';

export const POST = auth(async function POST(request: any, context: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const aid = context.params.aid;

    const appointment = await Appointment.findOne({ aid });
    if (!appointment) {
      return NextResponse.json(
        { message: 'Appointment not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const previousDate = appointment.date;
    const newDate = data.date;

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { aid },
      {
        date: newDate,
        status: request.auth?.user?.role === 'user' ? 'booked' : 'confirmed'
      },
      { new: true }
    );
    if (!updatedAppointment) {
      return NextResponse.json(
        { message: 'Appointment not found' },
        { status: 404 }
      );
    }

    const emailTasks = [
      sendHTMLEmail({
        to: updatedAppointment.patient.email,
        cc: updatedAppointment.doctor?.email || '',
        subject: `Appointment Rescheduled to ${format(new Date(newDate), 'PPp')}`,
        html: RescheduledAppointment(updatedAppointment, previousDate)
      }).catch((error) => {
        console.error(error);
        throw new Error('Failed to send email');
      })
    ];

    Promise.all(emailTasks);

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
