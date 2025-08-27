import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { connectDB } from '@/lib/db';
import { withAuth } from '@/middleware/withAuth';
import { validateOrganizationId } from '@/lib/server-actions/validation';
import { validateRequest } from '@/services';
import { createOrganizationUserSchema } from '@/services/organization/validation';
import { OrganizationService } from '@/services/organization/service';

type Params = Promise<{
  id: string;
}>;

export const GET = withAuth(async (_request: NextAuthRequest, { params }: { params: Params }) => {
  const { id } = await params;
  const doesOrganizationExist = await validateOrganizationId(id);
  if (!doesOrganizationExist) {
    return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
  }

  const conn = await connectDB(id);
  const result = await OrganizationService.getOrganizationUsers(conn);
  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: result.code });
  }

  return NextResponse.json({ data: result.data });
});

export const POST = withAuth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  try {
    const { id } = await params;

    const doesOrganizationExist = await validateOrganizationId(id);
    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const body = await request.json();

    const validation = validateRequest(createOrganizationUserSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: validation.errors },
        { status: 400 }
      );
    }

    const conn = await connectDB(id);
    const result = await OrganizationService.createOrganizationUser(conn, id, validation.data);

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: result.code });
    }

    return NextResponse.json({ message: result.message, data: result.data });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
