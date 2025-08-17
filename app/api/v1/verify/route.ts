import { NextResponse } from 'next/server';

export const POST = async function POST() {
  const allowedRoles = ['admin', 'doctor', 'receptionist'];
  const userRole = 'patient';
  const id = 'abc';
  const paramid = 'ac';
  // @ts-expect-error - TODO: fix this
  if (id !== paramid) {
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.json({ message: 'Authorized' });
};
