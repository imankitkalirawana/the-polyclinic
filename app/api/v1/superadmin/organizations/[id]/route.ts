import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Organization from '@/models/Organization';
import { UpdateOrganizationType } from '@/types/organization';
import { $FixMe } from '@/types';

type Params = Promise<{
  id: string;
}>;

// GET - Get organization by ID (superadmin only)
export const GET = auth(async (request: NextAuthRequest, { params }: { params: Params }) => {
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

    await connectDB();
    const { id } = await params;

    const organization = await Organization.findById(id);
    if (!organization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Organization fetched successfully',
      data: organization,
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

    await connectDB();
    const { id } = await params;
    const data: UpdateOrganizationType = await request.json();

    // Check if organization exists
    const existingOrganization = await Organization.findById(id);
    if (!existingOrganization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    // If domain is being updated, check for uniqueness
    if (data.domain && data.domain !== existingOrganization.domain) {
      const domainExists = await Organization.findOne({
        domain: data.domain.toLowerCase(),
        _id: { $ne: id },
      });
      if (domainExists) {
        return NextResponse.json(
          { message: 'Organization with this domain already exists' },
          { status: 409 }
        );
      }
    }

    const updatedOrganization = await Organization.findByIdAndUpdate(
      id,
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

    await connectDB();
    const { id } = await params;

    const organization = await Organization.findById(id);
    if (!organization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    await Organization.findByIdAndDelete(id);

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
