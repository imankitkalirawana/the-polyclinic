import { NextResponse } from 'next/server';

export const POST = async function POST(request: any) {
  const allowedRoles = ['admin', 'doctor', 'receptionist'];
  const userRole = 'user';
  const id = 'abc';
  const paramid = 'ac';
  // @ts-ignore
  if (id !== paramid) {
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.json({ message: 'Authorized' });
};
