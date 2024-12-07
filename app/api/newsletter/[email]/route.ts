import { NextResponse } from 'next/server';
import Newsletter from '@/models/Newsletter';
import { connectDB } from '@/lib/db';

export const DELETE = async function DELETE(_request: any, context: any) {
  try {
    const email = context.params.email;
    await connectDB();
    const newsletter = await Newsletter.findOneAndDelete({ email });
    if (!newsletter) {
      return NextResponse.json(
        { message: 'Newsletter not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Newsletter deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
