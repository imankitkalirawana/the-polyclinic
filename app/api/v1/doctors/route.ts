import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { BetterAuthRequest } from '@/types/better-auth';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import User from '@/models/User';

export const GET = auth(async (request: BetterAuthRequest) => {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

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

export const POST = auth(async (request: BetterAuthRequest) => {
  try {
    if (!request.auth?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const { uid, creation_type } = data;

    if (creation_type === 'existing' && !uid) {
      return NextResponse.json({ message: 'UID is required' }, { status: 400 });
    }

    await connectDB();

    if (creation_type === 'existing') {
      const user = await User.findOneAndUpdate({ uid }, { role: 'doctor' });

      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
    } else {
      // if creation_type is new then create a new user then create a new doctor
      const user = await User.create({
        ...data,
        role: 'doctor',
      });
      data.uid = user.uid;
    }

    const doctor = await Doctor.create(data);

    return NextResponse.json({
      message: 'Doctor created successfully',
      data: doctor,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
