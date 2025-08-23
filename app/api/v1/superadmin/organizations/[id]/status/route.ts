import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Organization from '@/models/Organization';
import { $FixMe } from '@/types';

type Params = Promise<{
  id: string;
}>;

// PATCH - Toggle organization status (superadmin only)
export const PATCH = auth(async (request: NextAuthRequest, { params }: { params: Params }) => {
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
    const { status } = await request.json();

    // Validate status
    if (!status || !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { message: 'Status must be either "active" or "inactive"' },
        { status: 400 }
      );
    }

    const organization = await Organization.findById(id);
    if (!organization) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const updatedOrganization = await Organization.findByIdAndUpdate(
      id,
      {
        status,
        updatedBy: request.auth.user.email,
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
