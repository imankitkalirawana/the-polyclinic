import { NextResponse } from 'next/server';
import User, { UserStatus } from '@/models/User';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(request: any) {
  try {
    const allowedRoles = ['admin', 'receptionist'];

    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const status = searchParams.get('status')?.split(',') || [];
    const query = searchParams.get('query')?.trim() || '';
    const sort = {
      column: searchParams.get('sortColumn') || 'name',
      direction: searchParams.get('sortDirection') || 'ascending'
    };

    const searchQuery = {
      ...(query
        ? {
            $or: [
              { name: { $regex: new RegExp(query.trim(), 'ig') } },
              { email: { $regex: new RegExp(query.trim(), 'ig') } },
              { phone: { $regex: new RegExp(query.trim(), 'ig') } },
              { status: { $regex: new RegExp(query.trim(), 'ig') } },
              { uid: isNaN(parseInt(query)) ? undefined : parseInt(query, 10) }
            ].filter(Boolean) as any[]
          }
        : {}),
      ...(status.length && !status.includes('all')
        ? { status: { $in: status } }
        : {})
    };

    await connectDB();

    // Build the sort object dynamically
    const sortObject: Record<string, 1 | -1> = {
      [sort.column]: (sort.direction === 'ascending' ? 1 : -1) as 1 | -1
    };
    const users = await User.find(searchQuery)
      .sort(sortObject)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .catch((error) => {
        throw new Error(error.message);
      });

    const total = await User.countDocuments(searchQuery);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ users, total, totalPages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const POST = auth(async function POST(request: any) {
  try {
    const allowedRoles = ['admin', 'receptionist'];
    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    const user = new User(data);
    await user.save();
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
