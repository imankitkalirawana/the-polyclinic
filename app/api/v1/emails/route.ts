import { NextResponse } from 'next/server';
import Email from '@/models/Email';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(request: any) {
  try {
    const allowedRoles = ['admin'];

    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const query = searchParams.get('query')?.trim() || '';
    const sort = {
      column: searchParams.get('sortColumn') || 'createdAt',
      direction: searchParams.get('sortDirection') || 'descending'
    };

    const searchQuery = {
      ...(query
        ? {
            $or: [
              { from: { $regex: new RegExp(query.trim(), 'ig') } },
              { total: { $regex: new RegExp(query.trim(), 'ig') } },
              { subject: { $regex: new RegExp(query.trim(), 'ig') } },
              { message: { $regex: new RegExp(query.trim(), 'ig') } }
            ].filter(Boolean) as any[]
          }
        : {})
    };

    await connectDB();

    const sortObject: Record<string, 1 | -1> = {
      [sort.column]: (sort.direction === 'ascending' ? 1 : -1) as 1 | -1
    };
    const emails = await Email.find(searchQuery)
      .sort(sortObject)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .catch((error) => {
        throw new Error(error.message);
      });

    const total = await Email.countDocuments(searchQuery);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ emails, total, totalPages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const POST = async function POST(request: any) {
  try {
    const data = await request.json();

    await connectDB();
    const email = new Email(data);
    await email.save();
    return NextResponse.json({
      email,
      message: 'Email sent successfully'
    });

    await connectDB();
    // const res =
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
