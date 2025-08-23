import { getAppointmentsWithDetails } from './../../../../helpers/api/appointments/index';
import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { API_ACTIONS } from '@/lib/config';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { UserType } from '@/types/user';

export const GET = auth(async (request: NextAuthRequest) => {
  try {
    await connectDB();

    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const role = request.auth?.user?.role;
    const queryMap: Record<UserType['role'], { $match: Record<string, unknown> }> = {
      superadmin: {
        $match: {},
      },
      admin: {
        $match: {},
      },
      doctor: {
        $match: { doctor: request.auth?.user?.uid },
      },
      receptionist: {
        $match: {},
      },
      user: { $match: { patient: request.auth?.user?.uid } },
      nurse: { $match: {} },
      pharmacist: { $match: {} },
      laboratorist: { $match: {} },
    };

    const appointments = await getAppointmentsWithDetails({
      query: queryMap[role],
      isStage: true,
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const POST = auth(async (request: NextAuthRequest) => {
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

    // try {
    //   if (APPOINTMENT.isGoogleCalendar) {
    //     Promise.all([axios.request(config)]);
    //   }
    // } catch (error) {
    //   console.error('Error in sending appointment to n8n:', error);
    // }

    return NextResponse.json(appointment);
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const PATCH = auth(async (request: NextAuthRequest) => {
  try {
    const allowedRoles = ['admin', 'receptionist'];
    if (request.auth?.user && !allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { ids } = await request.json();

    await Appointment.updateMany(ids[0] === -1 ? {} : { aid: { $in: ids } }, {
      $set: { status: 'cancelled' },
    });

    return NextResponse.json({ message: 'Appointments cancelled' }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const DELETE = auth(async (request: NextAuthRequest) => {
  try {
    const allowedRoles = ['admin', 'receptionist'];
    if (request.auth?.user && !allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
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
      (await Appointment.deleteMany(ids[0] === -1 ? {} : { aid: { $in: ids } }));

    return NextResponse.json(
      {
        message: `${ids[0] === -1 ? 'All' : ids.length} Appointment${
          ids.length > 1 ? 's' : ''
        } deleted`,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
