import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { $FixMe } from '@/types';
import { getSlotModel } from '@/services/client/doctor/model';
import { getSubdomain } from '@/auth/sub-domain';
import { validateOrganizationId } from '@/lib/server-actions/validation';

export const GET = auth(async (_request: NextAuthRequest, context: $FixMe) => {
  try {
    const { uid } = await context.params;

    const subdomain = await getSubdomain();
    if (!subdomain) {
      return NextResponse.json({ message: 'Subdomain not found' }, { status: 400 });
    }

    const doesOrganizationExist = await validateOrganizationId(subdomain);
    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const conn = await connectDB(subdomain);
    const Slot = getSlotModel(conn);

    const slots = await Slot.findOne({ uid });

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

    const subdomain = await getSubdomain();
    if (!subdomain) {
      return NextResponse.json({ message: 'Subdomain not found' }, { status: 400 });
    }

    const doesOrganizationExist = await validateOrganizationId(subdomain);
    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const conn = await connectDB(subdomain);
    const Slot = getSlotModel(conn);

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
