import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { connectDB } from '@/lib/db';
import { withAuth } from '@/middleware/withAuth';
import { OrganizationService } from '@/services/client/organization/service';
import { validateRequest } from '@/services';
import { updateOrganizationSchema } from '@/services/client/organization/validation';

type Params = Promise<{
  id: string;
}>;

export const GET = withAuth(async (_request: NextAuthRequest, { params }: { params: Params }) => {
  const { id } = await params;
  try {
    const conn = await connectDB();

    const result = await OrganizationService.getFullOrganization(conn, id);
    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: result.code });
    }

    return NextResponse.json({
      message: 'Organization fetched successfully',
      data: {
        organization: result.data?.organization || null,
        users: result.data?.users || [],
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  const { id } = await params;
  try {
    const conn = await connectDB();
    const body = await request.json();

    const validation = validateRequest(updateOrganizationSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: validation.errors },
        { status: 400 }
      );
    }

    const result = await OrganizationService.updateOrganization(conn, id, body);
    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: result.code });
    }

    return NextResponse.json({ message: result.message });
  } catch (error: unknown) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(
  async (_request: NextAuthRequest, { params }: { params: Params }) => {
    try {
      const conn = await connectDB();
      const { id } = await params;

      if (!id) {
        return NextResponse.json({ message: 'Organization ID is required' }, { status: 400 });
      }

      const result = await OrganizationService.deleteOrganization(conn, id);
      if (!result.success) {
        return NextResponse.json({ message: result.message }, { status: result.code });
      }

      return NextResponse.json({ message: result.message });
    } catch (error: unknown) {
      console.error('Error deleting organization:', error);
      return NextResponse.json(
        { message: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
);
