import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { auth } from '@/auth';
import { API_ACTIONS } from '@/lib/config';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/models/User';
import { withAuth } from '@/middleware/withAuth';
import { UserService } from '@/services/common/user/service';
import { getSubdomain } from '@/auth/sub-domain';

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

    const result = await UserService.getUsers({ conn, role, uid });

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
    const allowedRoles = ['admin', 'receptionist'];
    if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    const conn = await connectDB();
    const User = getUserModel(conn);

    const user = new User(data);
    await user.save();
    return NextResponse.json({
      message: 'User created successfully',
      data: user,
    });
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
    const allowedRoles = ['admin', 'receptionist'];
    if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const conn = await connectDB();
    const User = getUserModel(conn);

    const { ids } = await request.json();

    if (API_ACTIONS.isDelete) {
      const res = await User.deleteMany({ uid: { $in: ids } });
      return NextResponse.json({
        message: `${res.deletedCount} Users deleted successfully`,
      });
    }

    return NextResponse.json({
      message: `${ids.length} Users deleted successfully`,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
