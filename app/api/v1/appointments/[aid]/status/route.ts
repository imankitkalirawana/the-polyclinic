import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';
import { sendHTMLEmail } from '@/functions/server-actions/emails/send-email';
import { AppointmentStatus } from '@/utils/email-template/patient';

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
    const status = data.status;

    if (!status) {
      return NextResponse.json(
        { message: 'Status not provided!' },
        { status: 400 }
      );
    }

    const accessMap: { [key: string]: string[] } = {
      user: ['booked', 'cancelled'],
      doctor: ['confirmed', 'cancelled', 'completed', 'on-hold', 'in-progress'],
      receptionist: ['confirmed', 'cancelled'],
      admin: [
        'confirmed',
        'cancelled',
        'completed',
        'on-hold',
        'in-progress',
        'overdue',
        'booked'
      ]
    };

    if (!accessMap[request.auth?.user.role].includes(status)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { aid },
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { message: 'An error occured, please try again...' },
        { status: 404 }
      );
    }

    const emailTasks = [
      sendHTMLEmail({
        to: updatedAppointment.patient.email,
        cc: updatedAppointment.doctor?.email || '',
        subject: `Your Appointment with ID: ${updatedAppointment.aid} is ${status}`,
        html: AppointmentStatus(updatedAppointment)
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
