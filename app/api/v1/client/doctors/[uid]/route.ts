import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import { $FixMe } from '@/types';

export const GET = auth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    const allowedRoles = ['admin', 'doctor'];

    if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { uid } = await context.params;

    await connectDB();

    const doctors = await Doctor.aggregate([
      {
        $match: {
          uid: parseInt(uid),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'uid',
          foreignField: 'uid',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          name: '$user.name',
          email: '$user.email',
          phone: '$user.phone',
          gender: '$user.gender',
          image: '$user.image',
        },
      },
      {
        $project: {
          user: 0,
        },
      },
    ]);

    return NextResponse.json({
      message: 'Doctor fetched successfully',
      data: doctors[0],
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
