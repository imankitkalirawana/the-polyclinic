import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import User from '@/models/User';

export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    const allowedRoles = ['admin'];

    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const uid = await context.params.uid;

    await connectDB();

    const doctor = await Doctor.findOneAndDelete({ uid: parseInt(uid) });

    if (!doctor) {
      return NextResponse.json(
        { message: 'Doctor not found' },
        { status: 404 }
      );
    }

    await User.findOneAndDelete({ uid: parseInt(uid) });

    return NextResponse.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
