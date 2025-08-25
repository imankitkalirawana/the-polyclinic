import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Slot from '@/models/Slot';
import { $FixMe } from '@/types';

export const GET = auth(async (_request: NextAuthRequest, context: $FixMe) => {
  try {
    const { uid } = await context.params;

    await connectDB();

    const slots = await Slot.findOne({ uid: Number(uid) });

    return NextResponse.json(slots);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

export const POST = auth(async (request: NextAuthRequest, context: $FixMe) => {
  try {
    const { uid } = await context.params;
    const data = await request.json();

    await connectDB();

    const existingSlot = await Slot.findOne({ uid: Number(uid), title: data.title });
    if (existingSlot) {
      existingSlot.set(data);
      await existingSlot.save();
      return NextResponse.json({
        message: 'Slot updated successfully',
        data: existingSlot,
      });
    } else {
      const slot = new Slot({ ...data, uid: Number(uid) });
      await slot.save();
      return NextResponse.json({
        message: 'Slot created successfully',
        data: slot,
      });
    }
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
