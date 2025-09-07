import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { connectDB } from '@/lib/db';
import { withAuth } from '@/middleware/withAuth';
import { getSubdomain } from '@/auth/sub-domain';
import { createAppointmentSchema } from '@/services/client/appointment';
import { validateRequest } from '@/services';
import { validateOrganizationId } from '@/lib/server-actions/validation';
import { OrganizationUser } from '@/services/common/user';
import { AppointmentService } from '@/services/client/appointment/service';

export const GET = withAuth(async (request: NextAuthRequest) => {
  try {
    const subdomain = await getSubdomain();

    const doesOrganizationExist = await validateOrganizationId(subdomain);
    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const conn = await connectDB(subdomain);

    const role = request.auth?.user?.role;
    const queryMap: Record<OrganizationUser['role'], { $match: Record<string, unknown> }> = {
      admin: {
        $match: {},
      },
      doctor: {
        $match: { doctor: request.auth?.user?.uid },
      },
      receptionist: {
        $match: {},
      },
      patient: { $match: { patient: request.auth?.user?.uid } },
      nurse: { $match: {} },
      pharmacist: { $match: {} },
    };

    const result = await AppointmentService.getAll(
      conn,
      queryMap[role as OrganizationUser['role']]
    );

    return NextResponse.json(result.data);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request: NextAuthRequest) => {
  try {
    const subdomain = await getSubdomain();
    const conn = await connectDB(subdomain);
    const body = await request.json();

    const validation = validateRequest(createAppointmentSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: validation.errors },
        { status: 400 }
      );
    }

    const result = await AppointmentService.create(conn, body);

    return NextResponse.json({ message: result.message, data: result.data });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const PATCH = withAuth(async (_request: NextAuthRequest) => {
  try {
    await connectDB();
    // const { ids } = await request.json();

    // await Appointment.updateMany(ids[0] === -1 ? {} : { aid: { $in: ids } }, {
    //   $set: { status: 'cancelled' },
    // });

    return NextResponse.json({ message: 'Appointments cancelled' }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (request: NextAuthRequest) => {
  try {
    await connectDB();
    const { ids } = await request.json();

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No appointments to delete' },
        { status: 400 }
      );
    }

    // API_ACTIONS.isDelete &&
    //   (await Appointment.deleteMany(ids[0] === -1 ? {} : { aid: { $in: ids } }));

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
