import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import Doctor from '@/models/client/Doctor';

export const GET = auth(async (request: NextAuthRequest) => {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const doctors = await Doctor.aggregate([
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
      message: 'Doctors fetched successfully',
      data: doctors,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
