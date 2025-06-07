import { NextResponse } from 'next/server';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';

import { auth } from '@/auth';
import { connectDB, disconnectDB } from '@/lib/db';
import User from '@/models/User';

export const POST = auth(async function POST(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { ids } = await request.json();

    let users;

    await connectDB();

    if (ids.length > 0) {
      users = await User.find({ uid: { $in: ids } })
        .select('-password')
        .sort({ uid: 1 });
    } else {
      users = await User.find().select('-password').sort({ uid: 1 });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');
    worksheet.columns = [
      { header: 'UID', key: 'uid', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 30 },
      { header: 'Role', key: 'role', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'DOB', key: 'dob' },
      { header: 'Created At', key: 'createdAt', width: 30 },
      { header: 'Created By', key: 'createdBy', width: 30 },
      { header: 'Updated At', key: 'updatedAt', width: 30 },
      { header: 'Updated By', key: 'updatedBy', width: 30 },
    ];

    users.forEach((user) => {
      worksheet.addRow({
        uid: user.uid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        gender: user.gender,
        dob: user.dob,
        createdAt: format(new Date(user.createdAt), 'PPPp'),
        createdBy: user.createdBy,
        updatedAt: format(new Date(user.updatedAt), 'PPPp'),
        updatedBy: user.updatedBy,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="users.xlsx"',
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});
