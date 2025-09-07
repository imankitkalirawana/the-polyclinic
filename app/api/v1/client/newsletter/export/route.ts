import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import ExcelJS from 'exceljs';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { humanReadableDate } from '@/lib/utility';
import Newsletter from '@/models/client/Newsletter';

export const GET = auth(async (request: NextAuthRequest) => {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const newsletters = await Newsletter.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Newsletters');
    worksheet.columns = [
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Date', key: 'createdAt', width: 20 },
    ];

    newsletters.forEach((newsletter) => {
      worksheet.addRow({
        email: newsletter.email,
        createdAt: humanReadableDate(newsletter.createdAt),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="newsletters.xlsx"',
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
