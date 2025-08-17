import { NextResponse } from 'next/server';

import { connectDB } from '@/lib/db';
import { BetterAuthRequest } from '@/types/better-auth';
import Newsletter from '@/models/Newsletter';
import { $FixMe } from '@/types';

export const DELETE = async function DELETE(_request: BetterAuthRequest, context: $FixMe) {
  try {
    const { email } = await context.params;
    await connectDB();
    const newsletter = await Newsletter.findOneAndDelete({ email });
    if (!newsletter) {
      return NextResponse.json({ message: 'Newsletter not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Newsletter deleted successfully' });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
};
