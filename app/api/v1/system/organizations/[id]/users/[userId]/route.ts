import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { connectDB } from '@/lib/db';
import { withAuth } from '@/middleware/withAuth';
import {
  validateOrganizationId,
  validateUserInOrganization,
} from '@/lib/server-actions/validation';
import { OrganizationService } from '@/services/organization/service';
import { updateOrganizationUserSchema } from '@/services/organization/validation';
import { validateRequest } from '@/services';

type Params = Promise<{
  id: string;
  userId: string;
}>;

export const GET = withAuth(async (_request: NextAuthRequest, { params }: { params: Params }) => {
  const { id, userId } = await params;

  const doesOrganizationExist = await validateOrganizationId(id);
  if (!doesOrganizationExist) {
    return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
  }

  const doesUserExist = await validateUserInOrganization(id, userId);
  if (!doesUserExist) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const conn = await connectDB(id);
  const result = await OrganizationService.getOrganizationUser(conn, id, userId);
  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: result.code });
  }

  return NextResponse.json({ data: result.data });
});

export const PUT = withAuth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  const { id, userId } = await params;
  try {
    const doesOrganizationExist = await validateOrganizationId(id);
    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const conn = await connectDB(id);
    const body = await request.json();
    const validation = validateRequest(updateOrganizationUserSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: validation.errors },
        { status: 400 }
      );
    }

    const result = await OrganizationService.updateOrganizationUser(
      conn,
      id,
      userId,
      validation.data
    );
    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: result.code });
    }

    return NextResponse.json({ message: result.message, data: result.data });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(
  async (_request: NextAuthRequest, { params }: { params: Params }) => {
    const { id, userId } = await params;

    const doesOrganizationExist = await validateOrganizationId(id);
    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const conn = await connectDB(id);
    const result = await OrganizationService.deleteOrganizationUser(conn, id, userId);
    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: result.code });
    }

    return NextResponse.json({ message: result.message });
  }
);
