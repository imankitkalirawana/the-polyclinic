import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { connectDB } from '@/lib/db';
import { getOrganizationModel } from '@/models/system/Organization';
import { withAuth } from '@/middleware/withAuth';
import { validateRequest } from '@/services';
import { createOrganizationSchema } from '@/services/client/organization/validation';

export const GET = withAuth(async () => {
  try {
    const conn = await connectDB();
    const Organization = getOrganizationModel(conn);
    const organizations = await Organization.find().sort({ createdAt: -1 });

    return NextResponse.json({
      message: 'Organizations fetched successfully',
      data: organizations,
    });
  } catch (error: unknown) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request: NextAuthRequest) => {
  try {
    const conn = await connectDB();
    const Organization = getOrganizationModel(conn);

    const body = await request.json();

    const validation = validateRequest(createOrganizationSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: validation.errors },
        { status: 400 }
      );
    }

    const existingOrganization = await Organization.findOne({
      domain: validation.data.domain,
    });

    if (existingOrganization) {
      return NextResponse.json(
        { message: 'Organization with this domain already exists' },
        { status: 409 }
      );
    }

    const organization = new Organization({
      ...validation.data,
      domain: validation.data.domain,
      createdBy: request.auth?.user?.email,
    });

    await organization.save();

    return NextResponse.json(
      {
        message: 'Organization created successfully',
        data: organization,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
