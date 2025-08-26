import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { connectDB } from '@/lib/db';
import { getOrganizationModel } from '@/models/system/Organization';
import { UpdateOrganizationType } from '@/types/system/organization';
import { withAuth } from '@/middleware/withAuth';
import { OrganizationService } from '@/services/client/organization/service';

type Params = Promise<{
  id: string;
}>;

export const GET = withAuth(async (_request: NextAuthRequest, { params }: { params: Params }) => {
  try {
    const conn = await connectDB();

    const { id } = await params;
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
  try {
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
        updatedBy: request.auth?.user?.email,
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

export const DELETE = withAuth(
  async (_request: NextAuthRequest, { params }: { params: Params }) => {
    try {
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
  }
);
