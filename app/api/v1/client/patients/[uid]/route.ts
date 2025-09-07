import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { withAuth } from '@/middleware/withAuth';
import { getSubdomain } from '@/auth/sub-domain';
import { validateOrganizationId } from '@/lib/server-actions/validation';
import { PatientService } from '@/services/client/patient/service';

type Params = Promise<{
  uid: string;
}>;

export const GET = withAuth(async (_req: NextAuthRequest, { params }: { params: Params }) => {
  try {
    const { uid } = await params;
    const subdomain = await getSubdomain();
    if (!subdomain) {
      return NextResponse.json({ message: 'Subdomain not found' }, { status: 400 });
    }

    const doesOrganizationExist = await validateOrganizationId(subdomain);
    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }
    const conn = await connectDB(subdomain);
    const result = await PatientService.getByUID({
      conn,
      uid,
    });

    if (!result.success) {
      return NextResponse.json(
        { message: result.message || 'Failed to fetch patient' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: result.message, data: result.data });
  } catch (error) {
    return NextResponse.error();
  }
});
