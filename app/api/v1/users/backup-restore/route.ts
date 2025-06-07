import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { connectDB, disconnectDB } from '@/lib/db';
import User from '@/models/User';

export const GET = auth(async function GET(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const users = await User.find().lean(); // Fetch all users

    const json = JSON.stringify(users, null, 2);

    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="users_backup.json"',
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});

// restore users from a JSON file

export const POST = auth(async function POST(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const fresh = formData.get('fresh');

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    const text = await file.text();
    const users = JSON.parse(text);

    await connectDB();

    if (fresh) await User.deleteMany({});

    await User.insertMany(users, { ordered: false }).catch((err) => {
      if (err.code !== 11000) throw err;
    });

    return NextResponse.json(
      { message: 'Database restored successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});
