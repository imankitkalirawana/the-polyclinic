import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { getAppointmentsWithDetails } from '@/helpers/api/appointments';

type Params = Promise<{
  uid: string;
}>;

export const GET = auth(async (req: NextAuthRequest, { params }: { params: Params }) => {
  const uid = Number((await params).uid);

  const allowedRoles = ['admin', 'doctor', 'receptionist', 'user'];
  const role = req.auth?.user?.role;

  if (!role || !allowedRoles.includes(role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const appointments = await getAppointmentsWithDetails({
      query: { patient: uid },
    });

    return NextResponse.json(appointments);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
