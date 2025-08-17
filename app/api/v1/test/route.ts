import { NextResponse } from 'next/server';

import { connectDB } from '@/lib/db';
import { BetterAuthRequest } from '@/types/better-auth';
import Appointment from '@/models/Appointment';

export const POST = async function POST(req: BetterAuthRequest) {
  try {
    await connectDB();
    const data = await req.json();

    const { from, to } = data;

    const start = new Date(from); // 2025-05-25T00:00:00Z
    const end = new Date(to); // 2025-07-26T00:00:00Z
    end.setDate(end.getDate() + 1); // 2025-07-27T00:00:00Z

    const dateQuery = {
      $gte: start,
      $lt: end,
    };

    console.log('dateQuery', dateQuery);

    const appointments = await Appointment.find({
      date: dateQuery,
    });

    return NextResponse.json({ message: 'POST request', appointments });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
};
