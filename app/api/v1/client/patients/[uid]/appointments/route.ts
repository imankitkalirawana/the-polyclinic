import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getAppointmentsWithDetails } from '@/services/client/appointment';
import { withAuth } from '@/middleware/withAuth';
import { getSubdomain } from '@/auth/sub-domain';

type Params = Promise<{
  uid: string;
}>;

export const GET = withAuth(async (req: NextAuthRequest, { params }: { params: Params }) => {
  const uid = Number((await params).uid);

  try {
    const subdomain = await getSubdomain();
    const conn = await connectDB(subdomain);
    const appointments = await getAppointmentsWithDetails({
      conn,
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
