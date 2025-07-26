import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { API_ACTIONS } from '@/lib/config';
import { connectDB } from '@/lib/db';
import { logActivity } from '@/lib/server-actions/activity-log';
import { trackObjectChanges } from '@/lib/utility';
import Appointment from '@/models/Appointment';
import { $FixMe } from '@/types';
import { Schema, Status } from '@/types/activity';
import { UserRole } from '@/types/user';

// get appointment by id from param
export const GET = auth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    const allowedRoles: UserRole[] = ['user', 'admin', 'doctor', 'receptionist'];

    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { aid } = context.params;

    const appointment = await Appointment.findOne({ aid });

    if (!appointment) {
      return NextResponse.json(
        {
          message: 'Appointment not found',
        },
        { status: 404 }
      );
    }

    // if request role is user and doesn't match appointment patient email, return unauthorized
    if (
      request.auth?.user?.role === 'user' &&
      request.auth?.user?.email !== appointment?.patient?.email
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // if request role is doctor and doesn't match appointment doctor email, return unauthorized
    if (
      request.auth?.user?.role === 'doctor' &&
      request.auth?.user?.email !== appointment?.doctor?.email
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(appointment);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
});

export const PATCH = auth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    const allowedRoles: UserRole[] = ['user', 'admin', 'doctor', 'receptionist'];

    const user = request.auth?.user;

    if (!allowedRoles.includes(user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { aid } = context.params;
    const data = await request.json();
    await connectDB();

    const appointment = await Appointment.findOne({ aid });

    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }

    // if request role is use and doesn't match appointment patient email, return unauthorized
    if (user?.role === 'user') {
      if (user?.email !== appointment?.patient?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      if (data.status && !['booked', 'cancelled'].includes(data.status)) {
        return NextResponse.json(
          { message: 'You are not allowed to update this appointment' },
          { status: 400 }
        );
      }
    }

    // if request role is doctor and doesn't match appointment doctor email, return unauthorized
    if (user?.role === 'doctor' && user?.email !== appointment?.doctor?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // update appointment
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { aid },
      { $set: data },
      { new: true }
    );

    const { changedFields, fieldDiffs } = trackObjectChanges(appointment, updatedAppointment);

    await logActivity({
      id: aid,
      title: `Appointment ${changedFields.includes('status') ? `status` : 'updated'}`,
      schema: 'appointment' as Schema,
      by: request.auth?.user as $FixMe,
      status: Status.SUCCESS,
      ip: request.headers.get('x-forwarded-for') ?? undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
      metadata: {
        fields: changedFields,
        diff: fieldDiffs,
      },
    });
    return NextResponse.json(updatedAppointment);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const DELETE = auth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    const user = request.auth?.user;
    const allowedRoles: UserRole[] = ['admin'];
    if (!allowedRoles.includes(user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { aid } = context.params;
    await connectDB();

    // delete appointment
    if (API_ACTIONS.isDelete) {
      await Appointment.findOneAndDelete({ aid });
    }

    await logActivity({
      id: aid,
      title: 'Appointment deleted',
      schema: 'appointment' as Schema,
      by: user as $FixMe,
      status: Status.SUCCESS,
      ip: request.headers.get('x-forwarded-for') ?? undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
    });

    return NextResponse.json(
      {
        message: 'Appointment deleted',
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
});
