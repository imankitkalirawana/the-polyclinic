import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';

export const GET = auth(async function GET(request: any) {
  try {
    if (request.auth?.user?.role !== 'receptionist') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    let users = await User.find().select('-password');
    users = users.filter((user) => user.email !== 'contact@divinely.dev');

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
      { header: 'Updated By', key: 'updatedBy', width: 30 }
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
        dob: `${user.dob.day}/${user.dob.month}/${user.dob.year}`,
        createdAt: format(new Date(user.createdAt), 'PPPp'),
        createdBy: user.createdBy,
        updatedAt: format(new Date(user.updatedAt), 'PPPp'),
        updatedBy: user.updatedBy
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="users.xlsx"'
      }
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
