import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { API_ACTIONS } from '@/lib/config';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { BetterAuthRequest } from '@/types/better-auth';

type Params = Promise<{
  uid: string;
}>;

// Role-based access control configuration
const ROLE_PERMISSIONS = {
  GET: ['admin', 'doctor', 'receptionist', 'nurse', 'pharmacist'],
  PUT: ['admin', 'doctor', 'receptionist'],
  DELETE: ['admin', 'doctor', 'receptionist'],
} as const;

/**
 * Validates user session and authorization
 */
async function validateAuth(request: Request, uid: string, requiredRoles: readonly string[]) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return { error: 'Unauthorized', status: 401 };
  }

  // Allow users to access their own data
  const isSelfAccess = session.user.id === uid;
  const hasRequiredRole = requiredRoles.includes(session.user.role ?? '');

  if (!isSelfAccess && !hasRequiredRole) {
    return { error: 'Insufficient permissions', status: 403 };
  }

  return { user: session.user };
}

/**
 * Parses and validates UID parameter
 */
async function parseUid(params: Params): Promise<number> {
  const { uid } = await params;
  const parsedUid = parseInt(uid, 10);

  if (isNaN(parsedUid) || parsedUid <= 0) {
    throw new Error('Invalid user ID');
  }

  return parsedUid;
}

/**
 * Finds user by UID with error handling
 */
async function findUserByUid(uid: number) {
  await connectDB();

  const user = await User.findOne({ uid });
  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Handles errors and returns appropriate response
 */
function handleError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof Error) {
    if (error.message === 'User not found') {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    if (error.message === 'Invalid user ID') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
}

// GET user by ID
export const GET = async (request: BetterAuthRequest, { params }: { params: Params }) => {
  try {
    const uid = await parseUid(params);
    const authResult = await validateAuth(request, uid.toString(), ROLE_PERMISSIONS.GET);

    if ('error' in authResult) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const user = await findUserByUid(uid);

    // Remove sensitive data before sending response
    const { password, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return handleError(error);
  }
};

// UPDATE user by ID
export const PUT = async (request: BetterAuthRequest, { params }: { params: Params }) => {
  try {
    const uid = await parseUid(params);
    const authResult = await validateAuth(request, uid.toString(), ROLE_PERMISSIONS.PUT);

    if ('error' in authResult) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const data = await request.json();

    // Validate request body
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ uid });
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData = { ...data };

    // Hash password if provided
    if (data.password) {
      if (typeof data.password !== 'string' || data.password.length < 6) {
        return NextResponse.json(
          { message: 'Password must be at least 6 characters long' },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    // Add audit trail
    updateData.updatedBy = authResult.user.email;
    updateData.updatedAt = new Date();

    // Update user
    const updatedUser = await User.findOneAndUpdate({ uid }, updateData, {
      new: true,
      runValidators: true,
      select: '-password', // Exclude password from response
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    return handleError(error);
  }
};

// DELETE user by ID
export const DELETE = async (request: Request, { params }: { params: Params }) => {
  try {
    const uid = await parseUid(params);
    const authResult = await validateAuth(request, uid.toString(), ROLE_PERMISSIONS.DELETE);

    if ('error' in authResult) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    await connectDB();

    // Check if user exists
    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Prevent self-deletion
    if (authResult.user.id === uid.toString()) {
      return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 });
    }

    // Check if deletion is enabled in configuration
    if (!API_ACTIONS.isDelete) {
      return NextResponse.json({ message: 'User deletion is disabled' }, { status: 403 });
    }

    // Perform soft delete or hard delete based on your business logic
    await User.findOneAndDelete({ uid });

    return NextResponse.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    return handleError(error);
  }
};
