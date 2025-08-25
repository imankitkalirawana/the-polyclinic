import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { connectDB } from '@/lib/db';
import Newsletter from '@/models/client/Newsletter';
import { $FixMe } from '@/types';

export const DELETE = async function DELETE(_request: NextAuthRequest, context: $FixMe) {
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
