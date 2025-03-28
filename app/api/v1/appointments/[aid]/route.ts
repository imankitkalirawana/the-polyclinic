import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

// get appointment by id from param
export const GET = auth(async function GET(request: any, context: any) {
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
    return NextResponse.json(appointment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist', 'user'];
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const aid = context.params.aid;
    await connectDB();

    const appointment = await Appointment.findOne({ aid });
    if (!appointment) {
      return NextResponse.json(
        { message: 'Appointment not found' },
        { status: 404 }
      );
    }

    if (
      request.auth?.user.role === 'user' &&
      appointment.patient.email !== request.auth?.user.email
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { aid },
      { status: 'cancelled' },
      { new: true }
    );

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
