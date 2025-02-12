import { NextResponse } from 'next/server';
import Service, { ServiceType } from '@/models/Service';
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
    const types = JSON.parse(
      decodeURIComponent(searchParams.get('types') || '%255B%2522all%2522%255D')
    );
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
              { description: { $regex: new RegExp(query.trim(), 'ig') } },
              { summary: { $regex: new RegExp(query.trim(), 'ig') } },
              {
                uniqueId: isNaN(parseInt(query))
                  ? undefined
                  : parseInt(query, 10)
              }
            ].filter(Boolean) as any[]
          }
        : {}),
      ...(types.length && !types.includes('all')
        ? { type: { $in: types } }
        : {})
    };

    await connectDB();

    const sortObject: Record<string, 1 | -1> = {
      [sort.column]: (sort.direction === 'ascending' ? 1 : -1) as 1 | -1
    };
    const services = await Service.find(searchQuery)
      .select('-description -summary -data')
      .sort(sortObject)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .catch((error) => {
        throw new Error(error.message);
      });

    const total = await Service.countDocuments(searchQuery);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ services, total, totalPages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

export const POST = auth(async function POST(request: any) {
  const allowedRoles = ['admin'];
  if (!allowedRoles.includes(request.auth?.user?.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    let data: ServiceType = await request.json();
    data.createdBy = request.auth.user.email;
    await connectDB();
    if (await Service.exists({ uniqueId: data.uniqueId })) {
      return NextResponse.json(
        { message: 'Unique ID already exists' },
        { status: 400 }
      );
    }
    const service = await Service.create(data);
    return NextResponse.json(service);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
