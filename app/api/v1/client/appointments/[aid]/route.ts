import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { API_ACTIONS } from '@/lib/config';
import { connectDB } from '@/lib/db';
import { logActivity } from '@/lib/server-actions/activity-log';
import { trackObjectChanges } from '@/lib/utility';
import { $FixMe } from '@/types';
import { Schema, Status } from '@/types/client/activity';
import { OrganizationUserRole } from '@/services/organization/types';
import { withAuth } from '@/middleware/withAuth';
import { getSubdomain } from '@/auth/sub-domain';
import { getAppointmentModel } from '@/services/client/appointment';
import { validateOrganizationId } from '@/lib/server-actions/validation';

// get appointment by id from param
export const GET = withAuth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    const params = await context.params;
    const aid = Number(params.aid);
    const role = request.auth?.user?.role;
    const subdomain = await getSubdomain();
    const conn = await connectDB(subdomain);
    const Appointment = getAppointmentModel(conn);

    const queryMap: Record<OrganizationUserRole, { $match: Record<string, unknown> }> = {
      admin: {
        $match: { aid },
      },
      doctor: {
        $match: { aid },
      },
      nurse: {
        $match: { aid },
      },
      patient: {
        $match: { aid },
      },
      receptionist: {
        $match: { aid },
      },
      pharmacist: {
        $match: { aid },
      },
    };
    const appointments = await Appointment.aggregate([
      queryMap[role as keyof typeof queryMap],
      {
        $lookup: {
          from: 'users',
          localField: 'patient',
          foreignField: 'uid',
          as: 'patientDetails',
        },
      },
      {
        $unwind: { path: '$patientDetails', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'doctor',
          foreignField: 'uid',
          as: 'doctorDetails',
        },
      },
      {
        $unwind: { path: '$doctorDetails', preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor',
          foreignField: 'uid',
          as: 'moreDoctorDetails',
        },
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
      { $limit: 1 },
    ]);

    if (appointments.length === 0) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json(appointments[0]);
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

export const PATCH = withAuth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    const user = request.auth?.user;
    const params = await context.params;
    const aid = Number(params.aid);
    const data = await request.json();
    const subdomain = await getSubdomain();

    const doesOrganizationExist = await validateOrganizationId(subdomain);

    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const conn = await connectDB(subdomain);
    const Appointment = getAppointmentModel(conn);

    const appointment = await Appointment.findOne({ aid });

    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }

    // if request role is use and doesn't match appointment patient email, return unauthorized
    if (user?.role === 'admin') {
      if (user?.uid !== appointment?.patient) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      if (data.status && !['booked', 'cancelled'].includes(data.status)) {
        return NextResponse.json(
          { message: 'You are not allowed to update this appointment' },
          { status: 400 }
        );
      }
    }

    if (user?.role === 'doctor' && user?.uid !== appointment?.doctor) {
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

export const DELETE = withAuth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    const user = request.auth?.user;
    const params = await context.params;
    const aid = Number(params.aid);
    const subdomain = await getSubdomain();

    const doesOrganizationExist = await validateOrganizationId(subdomain);

    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const conn = await connectDB(subdomain);
    const Appointment = getAppointmentModel(conn);

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
