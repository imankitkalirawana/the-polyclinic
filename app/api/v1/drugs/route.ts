import { NextResponse } from 'next/server';
import Drug from '@/models/Drug';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(request: any) {
  try {
    const allowedRoles = ['admin', 'receptionist', 'doctor', 'user'];

    if (!allowedRoles.includes(request.auth?.user?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const status = JSON.parse(
      decodeURIComponent(
        searchParams.get('status') || '%255B%2522all%2522%255D'
      )
    );
    const query = searchParams.get('query')?.trim() || '';
    const sort = {
      column: searchParams.get('sortColumn') || 'brandName',
      direction: searchParams.get('sortDirection') || 'ascending'
    };

    const searchQuery = {
      ...(query
        ? {
            $or: [
              { genericName: { $regex: new RegExp(query.trim(), 'ig') } },
              { brandName: { $regex: new RegExp(query.trim(), 'ig') } },
              { description: { $regex: new RegExp(query.trim(), 'ig') } },
              { manufacturer: { $regex: new RegExp(query.trim(), 'ig') } },
              { form: { $regex: new RegExp(query.trim(), 'ig') } },
              {
                did: isNaN(parseInt(query)) ? undefined : parseInt(query, 10)
              }
            ].filter(Boolean) as any[]
          }
        : {}),
      ...(status.length && !status.includes('all')
        ? { status: { $in: status } }
        : {})
    };

    await connectDB();

    const sortObject: Record<string, 1 | -1> = {
      [sort.column]: (sort.direction === 'ascending' ? 1 : -1) as 1 | -1
    };
    const drugs = await Drug.find(searchQuery)
      .sort(sortObject)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .catch((error) => {
        throw new Error(error.message);
      });

    const total = await Drug.countDocuments(searchQuery);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ drugs, total, totalPages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const POST = auth(async function POST(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    const drug = new Drug(data);
    await drug.save();
    return NextResponse.json(drug);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});

export const PUT = auth(async function PUT(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const data = await request.json();
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { message: 'Data must be an array of drugs' },
        { status: 400 }
      );
    }

    const drugs = await Drug.insertMany(data);
    return NextResponse.json(drugs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
