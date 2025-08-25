import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { getOrganizationModel } from '@/models/Organization';
import { UpdateOrganizationType } from '@/types/organization';
import { getUserModel } from '@/models/User';

type Params = Promise<{
  id: string;
}>;

export const GET = auth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  const allowedRoles = ['superadmin', 'ops'];

  if (!request.auth?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!allowedRoles.includes(request.auth.user.role)) {
    return NextResponse.json({ message: 'Forbidden: Access denied' }, { status: 403 });
  }
  try {
    const conn = await connectDB();
    const { id } = await params;
    const Organization = getOrganizationModel(conn);
    const organization = await Organization.findOne({ organizationId: id });
    if (!organization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const conn2 = await connectDB(organization.organizationId);

    const User = getUserModel(conn2);
    const users = await User.find();

    return NextResponse.json({
      message: 'Organization fetched successfully',
      data: {
        organization,
        users,
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

// PUT - Update organization (superadmin only)
export const PUT = auth(async (request: NextAuthRequest, { params }: { params: Params }) => {
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
    const { id } = await params;
    const data: UpdateOrganizationType = await request.json();

    // Check if organization exists
    const existingOrganization = await Organization.findOne({ organizationId: id });
    if (!existingOrganization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    // If domain is being updated, check for uniqueness
    if (data.domain && data.domain !== existingOrganization.domain) {
      const domainExists = await Organization.findOne({
        domain: data.domain.toLowerCase(),
        organizationId: { $ne: id },
      });
      if (domainExists) {
        return NextResponse.json(
          { message: 'Organization with this domain already exists' },
          { status: 409 }
        );
      }
    }

    const updatedOrganization = await Organization.findOneAndUpdate(
      { organizationId: id },
      {
        ...data,
        ...(data.domain && { domain: data.domain.toLowerCase() }),
        updatedBy: request.auth.user.email,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'Organization updated successfully',
      data: updatedOrganization,
    });
  } catch (error: unknown) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

// DELETE - Delete organization (superadmin only)
export const DELETE = auth(async (request: NextAuthRequest, { params }: { params: Params }) => {
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
    const { id } = await params;

    const organization = await Organization.findOne({ organizationId: id });
    if (!organization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    await Organization.deleteOne({ organizationId: id });

    return NextResponse.json({
      message: 'Organization deleted successfully',
    });
  } catch (error: unknown) {
    console.error('Error deleting organization:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
