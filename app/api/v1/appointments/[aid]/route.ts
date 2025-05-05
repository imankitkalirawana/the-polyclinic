import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Appointment, {
  AppointmentStatus,
  AppointmentType,
} from '@/models/Appointment';
import { UserRole } from '@/models/User';

// get appointment by id from param
export const GET = auth(async function GET(request: any, context: any) {
  try {
    const allowedRoles: UserRole[] = [
      UserRole.user,
      UserRole.admin,
      UserRole.doctor,
      UserRole.receptionist,
    ];

    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const aid = context.params.aid;

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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'An error occurred',
      },
      { status: 500 }
    );
  }
});

export const PATCH = auth(async function PATCH(request: any, context: any) {
  try {
    const allowedRoles: UserRole[] = [
      UserRole.user,
      UserRole.admin,
      UserRole.doctor,
      UserRole.receptionist,
    ];

    const user = request.auth?.user;

    if (!allowedRoles.includes(user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const aid = context.params.aid;
    const data = await request.json();
    await connectDB();

    const appointment = await Appointment.findOne({ aid });

    if (!appointment) {
      return NextResponse.json(
        { message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // if request role is use and doesn't match appointment patient email, return unauthorized
    if (user?.role === UserRole.user) {
      if (user?.email !== appointment?.patient?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      if (
        data.status &&
        ![AppointmentStatus.booked, AppointmentStatus.cancelled].includes(
          data.status
        )
      ) {
        return NextResponse.json(
          { message: 'You are not allowed to update this appointment' },
          { status: 400 }
        );
      }
    }

    // if request role is doctor and doesn't match appointment doctor email, return unauthorized
    if (
      user?.role === UserRole.doctor &&
      user?.email !== appointment?.doctor?.email
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // update appointment
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { aid },
      { $set: data },
      { new: true }
    );

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error(error);
  }
});

export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    const user = request.auth?.user;
    const allowedRoles: UserRole[] = [UserRole.admin];
    if (!allowedRoles.includes(user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const aid = context.params.aid;
    await connectDB();

    // delete appointment
    // await Appointment.findOneAndDelete({ aid });

    return NextResponse.json(
      {
        message: 'Appointment deleted',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'An error occurred',
      },
      { status: 500 }
    );
  }
});
