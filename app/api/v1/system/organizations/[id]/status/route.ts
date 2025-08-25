import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { connectDB } from '@/lib/db';
import { getOrganizationModel } from '@/models/system/Organization';
import { withAuth } from '@/middleware/withAuth';

type Params = Promise<{
  id: string;
}>;

// PATCH - Toggle organization status (superadmin only)
export const PATCH = withAuth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  try {
    const conn = await connectDB();
    const Organization = getOrganizationModel(conn);
    const { id } = await params;
    const { status } = await request.json();

    // Validate status
    if (!status || !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { message: 'Status must be either "active" or "inactive"' },
        { status: 400 }
      );
    }

    const organization = await Organization.findOne({ organizationId: id });
    if (!organization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const updatedOrganization = await Organization.findOneAndUpdate(
      { organizationId: id },
      {
        status,
        updatedBy: request.auth?.user?.email,
      },
      { new: true }
    );

    return NextResponse.json({
      message: `Organization ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: updatedOrganization,
    });
  } catch (error: unknown) {
    console.error('Error updating organization status:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
