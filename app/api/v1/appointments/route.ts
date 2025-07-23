import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { UserType } from '@/types/user';
import {
  API_ACTIONS,
  APPOINTMENT,
  CLINIC_INFO,
  MOCK_DATA,
  TIMINGS,
} from '@/lib/config';
import { generateAppointments } from '@/lib/appointments/mock';
import axios from 'axios';

let defaultConfig = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://n8n.divinely.dev/webhook/appointment/create',
  headers: {
    Authorization: `Bearer ${process.env.JWT_TOKEN}`,
    'Content-Type': 'application/json',
  },
  data: {},
};

export const GET = auth(async function GET(request: any) {
  try {
    const role: UserType['role'] = request.auth?.user?.role;
    const disallowedRoles: UserType['role'][] = [
      'nurse',
      'pharmacist',
      'laboratorist',
    ];

    if (disallowedRoles.includes(role)) {
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

    const queryMap: Record<UserType['role'], object> = {
      admin: {},
      receptionist: {},
      doctor: {
        'doctor.email': request.auth?.user?.email,
      },
      user: {
        'patient.email': request.auth?.user?.email,
      },
      nurse: {},
      pharmacist: {},
      laboratorist: {},
    };

    await connectDB();
    const appointments = await Appointment.find(queryMap[role]).sort({
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
    const allowedRoles = ['admin', 'doctor', 'receptionist', 'user'];
    // @ts-ignore
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    const appointment = new Appointment(data);
    await appointment.save();

    let dataContent = JSON.stringify({
      summary: `${CLINIC_INFO.name} - ${data.patient.name}/${data.doctor.name}`,
      description: data.additionalInfo.description,
      date: appointment.date,
      location: appointment.additionalInfo.type,
      duration: TIMINGS.appointment.interval,
      guests: [
        {
          name: data.patient.name,
          email: data.patient.email,
          role: 'patient',
        },
        {
          name: data.doctor.name,
          email: data.doctor.email,
          role: 'doctor',
        },
      ],
    });

    const config = {
      ...defaultConfig,
      data: dataContent,
    };

    try {
      if (APPOINTMENT.isGoogleCalendar) {
        Promise.all([axios.request(config)]);
      }
    } catch (error) {
      console.error('Error in sending appointment to n8n:', error);
    }

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
    const allowedRoles = ['admin', 'receptionist'];
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
    const allowedRoles = ['admin', 'receptionist'];
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

    API_ACTIONS.isDelete &&
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
