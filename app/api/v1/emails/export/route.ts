import { NextResponse } from 'next/server';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import { stripHtml } from 'string-strip-html'; // Install this package

import { auth } from '@/auth';
import { connectDB, disconnectDB } from '@/lib/db';
import Email from '@/models/Email';

export const GET = auth(async function GET(request: any) {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    let emails = await Email.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Emails');
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 20 },
      { header: 'To', key: 'to', width: 30 },
      { header: 'From', key: 'from', width: 30 },
      { header: 'Subject', key: 'subject', width: 30 },
      { header: 'Message', key: 'message', width: 100 },
      { header: 'Created At', key: 'createdAt', width: 30 },
      { header: 'Created By', key: 'createdBy', width: 30 },
      { header: 'Updated At', key: 'updatedAt', width: 30 },
      { header: 'Updated By', key: 'updatedBy', width: 30 },
    ];

    emails.forEach((email) => {
      worksheet.addRow({
        _id: email._id,
        to: email.to,
        from: email.from,
        subject: email.subject,
        message: stripHtml(email.message).result,
        createdAt: format(new Date(email.createdAt), 'PPPp'),
        createdBy: email.createdBy,
        updatedAt: format(new Date(email.updatedAt), 'PPPp'),
        updatedBy: email.updatedBy,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="emails.xlsx"',
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    await disconnectDB();
  }
});
