import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import User from '@/models/User';
import { auth } from '@/auth';
import { UserType } from '@/types/user';
import { connectDB } from '@/lib/db';

export const GET = auth(async (req: NextAuthRequest) => {
  try {
    if (!req.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const email = req.auth.user.email;
    const role = req.auth.user.role;

    const ALLOWED_ROLES = ['admin', 'receptionist', 'patient'];

    type UserRoleType = Extract<UserType['role'], 'admin' | 'receptionist' | 'patient'>;

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const queryMap: Record<UserRoleType, Record<string, unknown>> = {
      admin: {
        role: 'patient',
        status: { $in: ['active', 'unverified'] },
      },
      receptionist: {
        role: 'patient',
        status: { $in: ['active', 'unverified'] },
      },
      patient: {
        email,
        role: 'patient',
        status: { $in: ['active', 'unverified'] },
      },
    };

    let searchQuery = {};
    if (search.trim()) {
      const isNumber = !isNaN(Number(search));

      searchQuery = {
        $or: [
          { uid: isNumber ? Number(search) : undefined },
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ],
      };
    }

    await connectDB();

    const finalQuery = { ...queryMap[role as UserRoleType], ...searchQuery };

    const total = await User.countDocuments(finalQuery);

    const skip = (page - 1) * limit;
    const hasNextPage = skip + limit < total;

    const patients = await User.find(finalQuery)
      .select('-password')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      message: 'Patients fetched successfully',
      data: patients,
      pagination: {
        page,
        limit,
        total,
        hasNextPage,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const POST = auth(async (req: NextAuthRequest) => {
  try {
    if (!req.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const data = await req.json();
    const patient = await User.create(data);
    return NextResponse.json({ message: 'Patient created successfully', data: patient });
  } catch (error: unknown) {
    console.error(error);
  }
});
