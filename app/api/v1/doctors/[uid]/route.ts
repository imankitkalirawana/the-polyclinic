import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';

export const GET = auth(async function GET(request: any, context: any) {
  try {
    const allowedRoles = ['admin', 'doctor'];

    if (!allowedRoles.includes(request.auth?.user?.role)) {
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
