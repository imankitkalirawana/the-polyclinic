import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/services/common/user/model';
import { $FixMe } from '@/types';

export const GET = auth(async (request: NextAuthRequest) => {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const conn = await connectDB();
    const User = getUserModel(conn);

    const users = await User.find().lean(); // Fetch all users

    const json = JSON.stringify(users, null, 2);

    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="users_backup.json"',
      },
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});

// restore users from a JSON file

export const POST = auth(async (request: $FixMe) => {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const fresh = formData.get('fresh');

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const text = await file.text();
    const users = JSON.parse(text);

    const conn = await connectDB();
    const User = getUserModel(conn);

    if (fresh) await User.deleteMany({});

    await User.insertMany(users, { ordered: false }).catch((err) => {
      if (err.code !== 11000) throw err;
    });

    return NextResponse.json({ message: 'Database restored successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
});
