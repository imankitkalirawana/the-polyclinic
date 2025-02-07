import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';
import { AppointmentStatus } from '@/utils/email-template/patient';
import { NewAppointment } from '@/utils/email-template/doctor';
import { sendHTMLEmail } from '@/functions/server-actions/emails/send-email';

export const GET = auth(async function GET(request: any) {
  console.log('get request');
  try {
    const role = request.auth?.user?.role;

    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const referer = request.headers.get('referer');
    const refererStatus = new URL(referer).searchParams.get('status');

    const { searchParams } = new URL(request.url);
    let status = refererStatus || searchParams.get('status') || 'all';

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
        'on-hold'
      ]
    };

    // query map with respect to user role and status
    const queryMap: Record<string, object> = {
      doctor: {
        status: statusMap[status],
        'doctor.uid': request.auth?.user?.uid
      },
      user: {
        status: statusMap[status],
        'patient.email': request.auth?.user?.email
      },
      admin: {
        status: statusMap[status]
      },
      receptionist: {
        status: statusMap[status]
      }
    };

    await connectDB();
    const appointments = await Appointment.find(queryMap[role]);
    appointments.sort((a, b) => {
      const statusOrder = [
        'in-progress',
        'confirmed',
        'booked',
        'completed',
        'overdue',
        'cancelled'
      ];
      return (
        statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status) ||
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const POST = auth(async function POST(request: any) {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist', 'user'];
    // @ts-ignore
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    const appointment = new Appointment(data);
    await appointment.save();

    const emailTasks = [
      sendHTMLEmail({
        to: data.patient.email,
        subject: 'Booked: Appointment Confirmation',
        html: AppointmentStatus(appointment)
      }).catch((error) => {
        console.error('Failed to send patient email:', error);
      }),
      data.doctor?.email &&
        sendHTMLEmail({
          to: data.doctor.email,
          subject: `New Appointment Requested by ${data.patient.name}`,
          html: NewAppointment(appointment)
        }).catch((error) => {
          console.error('Failed to send doctor email:', error);
        })
    ];

    Promise.all(emailTasks).catch((error) => {
      console.error('Error in email sending:', error);
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
});
