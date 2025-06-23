import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { sendHTMLEmail } from '@/functions/server-actions/emails/send-email';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { NewAppointment } from '@/utils/email-template/doctor';
import { AppointmentStatus } from '@/utils/email-template/patient';
import { UserRole } from '@/types/user';
import { API_ACTIONS, MOCK_DATA } from '@/lib/config';
import { generateAppointments } from '@/lib/appointments/mock';

export const GET = auth(async function GET(request: any) {
  try {
    const disallowedRoles: UserRole[] = [
      UserRole.nurse,
      UserRole.pharmacist,
      UserRole.laboratorist,
    ];

    if (disallowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (MOCK_DATA.appointments.isMock) {
      const appointments = await generateAppointments({
        count: MOCK_DATA.appointments.count,
      });

      return NextResponse.json(
        appointments.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
    }

    const { searchParams } = new URL(request.url);
    let date = searchParams.get('date'); // YYYY-MM-DD
    const role = request.auth?.user?.role;

    // query map with respect to user role and status
    const queryMap: Record<string, object> = {
      doctor: {
        'doctor.uid': request.auth?.user?.uid,
      },
      user: {
        'patient.email': request.auth?.user?.email,
      },
      admin: {},
      receptionist: {},
    };

    const query = {
      ...queryMap[role],
      date: date ? { $regex: new RegExp(date, 'gi') } : { $exists: true },
    };

    await connectDB();
    const appointments = await Appointment.find(query).sort({
      date: 'ascending',
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const POST = auth(async function POST(request: any) {
  try {
    const allowedRoles = [
      UserRole.admin,
      UserRole.doctor,
      UserRole.receptionist,
      UserRole.user,
    ];
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
        html: AppointmentStatus(appointment),
      }).catch((error) => {
        console.error('Failed to send patient email:', error);
      }),
      data.doctor?.email &&
        sendHTMLEmail({
          to: data.doctor.email,
          subject: `New Appointment Requested by ${data.patient.name}`,
          html: NewAppointment(appointment),
        }).catch((error) => {
          console.error('Failed to send doctor email:', error);
        }),
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

export const PATCH = auth(async function PATCH(request: any) {
  try {
    const allowedRoles = [UserRole.admin, UserRole.receptionist];
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { ids } = await request.json();

    await Appointment.updateMany(ids[0] === -1 ? {} : { aid: { $in: ids } }, {
      $set: { status: 'cancelled' },
    });

    return NextResponse.json(
      { message: 'Appointments cancelled' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(request: any) {
  try {
    const allowedRoles = [UserRole.admin, UserRole.receptionist];
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { ids } = await request.json();

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No appointments to delete' },
        { status: 400 }
      );
    }

    !!API_ACTIONS.isDelete &&
      (await Appointment.deleteMany(
        ids[0] === -1 ? {} : { aid: { $in: ids } }
      ));

    return NextResponse.json(
      {
        message: `${ids[0] === -1 ? 'All' : ids.length} Appointment${
          ids.length > 1 ? 's' : ''
        } deleted`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
