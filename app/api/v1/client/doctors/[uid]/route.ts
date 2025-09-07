import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { getSubdomain } from '@/auth/sub-domain';
import { validateOrganizationId } from '@/lib/server-actions/validation';
import { DoctorService } from '@/services/client/doctor/service';

type Params = Promise<{
  uid: string;
}>;

export const GET = auth(async (request: NextAuthRequest, { params }: { params: Params }) => {
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
    const result = await DoctorService.getByUID({
      conn,
      uid,
    });
    if (!result.success) {
      return NextResponse.json(
        { message: result.message || 'Failed to fetch doctor' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Doctor fetched successfully',
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
