import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { connectDB } from '@/lib/db';
import { withAuth } from '@/middleware/withAuth';
import { UserService } from '@/services/common/user/service';
import { getSubdomain } from '@/auth/sub-domain';
import { validateRequest } from '@/services';
import { updateUserSchema } from '@/services/common/user';
import { SERVER_ERROR_MESSAGE } from '@/lib/constants';

type Params = Promise<{
  uid: string;
}>;

// get user by id from param
export const GET = withAuth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  try {
    const { uid } = await params;
    const requesterRole = request.auth?.user?.role;
    const requesterUid = request.auth?.user?.uid;

    if (!requesterRole || !requesterUid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const urlDomain = await getSubdomain();
    const { searchParams } = request.nextUrl;

    const subdomain = searchParams.get('subdomain') || urlDomain;
    const conn = await connectDB(subdomain);

    const result = await UserService.getUserByUid({
      conn,
      uid,
      requesterRole,
      requesterUid,
    });

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 404 });
    }

    return NextResponse.json({
      message: result.message,
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

// update user by id from param
export const PUT = withAuth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  try {
    const { uid } = await params;
    const updaterRole = request.auth?.user?.role;
    const updaterUid = request.auth?.user?.uid;
    const urlDomain = await getSubdomain();

    if (!updaterRole || !updaterUid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const subdomain = body.organization || urlDomain;

    // Validate request data using updateUserSchema
    const validation = validateRequest(updateUserSchema, { ...body, organization: subdomain });

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: validation.errors },
        { status: 400 }
      );
    }

    const conn = await connectDB(subdomain);

    const result = await UserService.updateUser({
      conn,
      uid,
      data: validation.data,
      updaterRole,
      updaterUid,
    });

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      message: result.message,
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

// delete user by id from param
export const DELETE = withAuth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  try {
    const { uid } = await params;
    const deleterRole = request.auth?.user?.role;
    const urlDomain = await getSubdomain();
    const body = await request.json();

    if (!deleterRole) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const subdomain = body.organization || urlDomain;
    const conn = await connectDB(subdomain);

    const result = await UserService.deleteUser({
      conn,
      uid,
      deleterRole,
    });

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      message: result.message,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : SERVER_ERROR_MESSAGE },
      { status: 500 }
    );
  }
});
