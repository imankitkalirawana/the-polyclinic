import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { auth } from '@/auth';
import { API_ACTIONS } from '@/lib/config';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/services/common/user/model';
import { withAuth } from '@/middleware/withAuth';
import { UserService } from '@/services/common/user/service';
import { getSubdomain } from '@/auth/sub-domain';
import { validateRequest } from '@/services';
import { createUserSchema } from '@/services/common/user';
import { validateOrganizationId } from '@/lib/server-actions/validation';

export const GET = withAuth(async (req: NextAuthRequest) => {
  try {
    const uid = req.auth?.user?.uid;
    const role = req.auth?.user?.role;

    if (!role || !uid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const urlDomain = await getSubdomain();

    // also get subdomain from params
    const { searchParams } = req.nextUrl;
    const subdomain = searchParams.get('subdomain') || urlDomain;

    const conn = await connectDB(subdomain);

    const result = await UserService.getAll({ conn, role, uid });

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 403 });
    }

    return NextResponse.json({
      message: 'Users fetched successfully',
      data: result.data,
    });
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
    const urlDomain = await getSubdomain();
    const userRole = request.auth?.user?.role;

    if (!userRole) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const subdomain = body.organization || urlDomain;

    const doesOrganizationExist = await validateOrganizationId(subdomain);
    if (!doesOrganizationExist && ['admin', 'receptionist'].includes(userRole)) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const validation = validateRequest(createUserSchema, { ...body, organization: subdomain });

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: validation.errors },
        { status: 400 }
      );
    }

    const conn = await connectDB(subdomain);

    const result = await UserService.create({
      conn,
      data: body,
    });

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: result.message,
        data: result.data,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

// Delete Users
export const DELETE = auth(async (request: NextAuthRequest) => {
  try {
    const urlDomain = await getSubdomain();
    const body = await request.json();

    const subdomain = body.organization || urlDomain;
    const conn = await connectDB(subdomain);
    const User = getUserModel(conn);

    if (API_ACTIONS.isDelete) {
      const res = await User.deleteMany({ uid: { $in: body.ids } });
      return NextResponse.json({
        message: `${res.deletedCount} Users deleted successfully`,
      });
    }

    return NextResponse.json({
      message: `${body.ids.length} Users deleted successfully`,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
