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

    const appointments = await Appointment.aggregate([
      queryMap[role],
      {
        $lookup: {
          from: 'users', // collection name
          localField: 'doctor',
          foreignField: 'uid', // doctor field matches user.uid
          as: 'doctorDetails',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'patient',
          foreignField: 'uid', // patient field matches user.uid
          as: 'patientDetails',
        },
      },
      {
        $lookup: {
          from: 'doctors', // doctors collection
          localField: 'doctor', // doctor UID from appointment
          foreignField: 'uid', // doctor UID in doctors collection
          as: 'moreDoctorDetails',
        },
      },
      {
        $unwind: { path: '$doctorDetails', preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: '$patientDetails', preserveNullAndEmptyArrays: false },
      },
      {
        $unwind: { path: '$moreDoctorDetails', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          date: 1,
          type: 1,
          status: 1,
          additionalInfo: 1,
          aid: 1,
          doctor: {
            name: '$doctorDetails.name',
            email: '$doctorDetails.email',
            uid: '$doctorDetails.uid',
            phone: '$doctorDetails.phone',
            image: '$doctorDetails.image',
            seating: '$moreDoctorDetails.seating',
          },
          patient: {
            name: '$patientDetails.name',
            email: '$patientDetails.email',
            uid: '$patientDetails.uid',
            phone: '$patientDetails.phone',
            image: '$patientDetails.image',
            gender: '$patientDetails.gender',
            age: '$patientDetails.age',
          },
          createdAt: 1,
          updatedAt: 1,
          updatedBy: 1,
        },
      },
    ]);

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
