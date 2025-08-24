import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  const { id, organizationSlug } = await request.json();

  if (!id || !organizationSlug) {
    return NextResponse.json(
      { error: 'Invitation ID and organization slug are required' },
      { status: 400 }
    );
  }

  try {
    // get invitation from db
    const invitation = await client
      .db(organizationSlug)
      .collection('invitation')
      .findOne({
        _id: new ObjectId(id),
      });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...invitation,
      id: invitation._id.toString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
