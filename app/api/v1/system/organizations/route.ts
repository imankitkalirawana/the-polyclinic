import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { connectDB } from '@/lib/db';
import { withAuth } from '@/middleware/withAuth';
import { validateRequest } from '@/services';
import { createOrganizationSchema } from '@/services/system/organization/validation';
import { OrganizationService } from '@/services/system/organization/service';

export const GET = withAuth(async () => {
  try {
    const conn = await connectDB();
    const result = await OrganizationService.getOrganizations(conn);

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: result.code });
    }

    return NextResponse.json({
      message: 'Organizations fetched successfully',
      data: result.data,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request: NextAuthRequest) => {
  try {
    const conn = await connectDB();
    const body = await request.json();

    const validation = validateRequest(createOrganizationSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: validation.errors },
        { status: 400 }
      );
    }

    const result = await OrganizationService.createOrganization(conn, validation.data);

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: result.code });
    }

    return NextResponse.json(
      {
        message: 'Organization created successfully',
        data: result.data,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
