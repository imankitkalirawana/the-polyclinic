import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { getOrganizationModel } from '@/models/Organization';
import { CreateOrganizationType } from '@/types/organization';

export const GET = auth(async (request: NextAuthRequest) => {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only superadmin can access this endpoint
    if (request.auth.user.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Forbidden: Superadmin access required' },
        { status: 403 }
      );
    }

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

// POST - Create new organization (superadmin only)
export const POST = auth(async (request: NextAuthRequest) => {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only superadmin can access this endpoint
    if (request.auth.user.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Forbidden: Superadmin access required' },
        { status: 403 }
      );
    }

    const conn = await connectDB();
    const Organization = getOrganizationModel(conn);
    const data: CreateOrganizationType = await request.json();

    // Validate required fields
    if (!data.name || !data.domain) {
      return NextResponse.json({ message: 'Name and domain are required' }, { status: 400 });
    }

    // Check if domain already exists
    const existingOrganization = await Organization.findOne({ domain: data.domain.toLowerCase() });
    if (existingOrganization) {
      return NextResponse.json(
        { message: 'Organization with this domain already exists' },
        { status: 409 }
      );
    }

    const organization = new Organization({
      ...data,
      domain: data.domain.toLowerCase(),
      createdBy: request.auth.user.email,
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
