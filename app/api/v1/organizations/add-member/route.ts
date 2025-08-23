import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const { userId, role, organizationId } = body;

  const data = await auth.api.addMember({
    body: {
      userId,
      role,
      organizationId,
    },
  });

  return NextResponse.json(data);
}
