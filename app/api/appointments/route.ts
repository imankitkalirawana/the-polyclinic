import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';
import { sendHTMLMail } from '@/lib/functions';
import { AppointmentStatus } from '@/utils/email-template/patient';
import { getDoctorWithUID } from '@/functions/server-actions';
import { NewAppointment } from '@/utils/email-template/doctor';

export const GET = auth(async function GET(request: any) {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const role = request.auth?.user?.role;

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
        doctor: request.auth?.user?.uid
      },
      user: {
        status: statusMap[status],
        uid: request.auth?.user?.uid
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
    console.log('Data:', data);

    const appointment = new Appointment(data);
    await appointment.save();
    let doctor;
    if (data.doctor) {
      doctor = await getDoctorWithUID(data.doctor);
    }
    const emailTasks = [
      sendHTMLMail(
        data.email,
        'Booked: Appointment Confirmation',
        AppointmentStatus(
          appointment,
          doctor ? `${doctor?.name} (#${doctor?.uid})` : '-'
        )
      ).catch((error) => {
        console.error('Failed to send patient email:', error);
      }),
      doctor?.email &&
        sendHTMLMail(
          doctor.email,
          `New Appointment Requested by ${data.name}`,
          NewAppointment(appointment)
        ).catch((error) => {
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
