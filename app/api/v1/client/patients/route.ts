import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/services/common/user/model';
import { withAuth } from '@/middleware/withAuth';
import { getSubdomain } from '@/auth/sub-domain';
import { validateOrganizationId } from '@/lib/server-actions/validation';
import { validateRequest } from '@/services';
import { createPatientSchema } from '@/services/client/patient/validation';
import { PatientService } from '@/services/client/patient/service';

export const GET = withAuth(async (_req: NextAuthRequest) => {
  try {
    const subdomain = await getSubdomain();
    if (!subdomain) {
      return NextResponse.json({ message: 'Subdomain not found' }, { status: 400 });
    }

    const doesOrganizationExist = await validateOrganizationId(subdomain);
    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const conn = await connectDB(subdomain);
    const result = await PatientService.getAll({ conn });

    if (!result.success) {
      return NextResponse.json(
        { message: result.message || 'Failed to fetch patients' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (req: NextAuthRequest) => {
  try {
    const body = await req.json();
    const subdomain = (await getSubdomain()) || body.organization;

    const doesOrganizationExist = await validateOrganizationId(subdomain);
    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const validation = validateRequest(createPatientSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid request', errors: validation.errors },
        { status: 400 }
      );
    }

    const conn = await connectDB();
    const User = getUserModel(conn);

    if (!req.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const data = await req.json();
    const patient = await User.create(data);
    return NextResponse.json({ message: 'Patient created successfully', data: patient });
  } catch (error: unknown) {
    console.error(error);
  }
});
