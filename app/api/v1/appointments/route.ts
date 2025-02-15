import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';
import { AppointmentStatus } from '@/utils/email-template/patient';
import { NewAppointment } from '@/utils/email-template/doctor';
import { sendHTMLEmail } from '@/functions/server-actions/emails/send-email';

export const GET = auth(async function GET(request: any) {
  try {
    const role = request.auth?.user?.role;

    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let date = searchParams.get('date'); // YYYY-MM-DD

    // query map with respect to user role and status
    const queryMap: Record<string, object> = {
      doctor: {
        'doctor.uid': request.auth?.user?.uid
      },
      user: {
        'patient.email': request.auth?.user?.email
      },
      admin: {},
      receptionist: {}
    };

    const query = {
      ...queryMap[role],
      date: date ? { $regex: new RegExp(date, 'gi') } : {}
    };

    await connectDB();
    const appointments = await Appointment.find(query).sort({
      date: 'ascending'
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
