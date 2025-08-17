import { NextResponse } from 'next/server';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';

import { auth } from '@/auth';
import { BetterAuthRequest } from '@/types/better-auth';
import { connectDB } from '@/lib/db';
import Service from '@/models/Service';

export const GET = auth(async (request: BetterAuthRequest) => {
  try {
    const allowedRoles = ['admin'];
    if (!allowedRoles.includes(request.auth?.user?.role ?? '')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const services = await Service.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Services');
    worksheet.columns = [
      { header: 'UID', key: 'uid', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Type', key: 'type', width: 10 },
      { header: 'Price (INR)', key: 'price', width: 10 },
      { header: 'Duration', key: 'duration', width: 20 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Summary', key: 'summary', width: 50 },
      { header: 'Created At', key: 'createdAt', width: 30 },
      { header: 'Created By', key: 'createdBy', width: 30 },
      { header: 'Updated At', key: 'updatedAt', width: 30 },
      { header: 'Updated By', key: 'updatedBy', width: 30 },
    ];

    services.forEach((service) => {
      worksheet.addRow({
        uid: service.uniqueId,
        status: service.status,
        name: service.name,
        type: service.type,
        price: service.price.toLocaleString('en-IN') || '-',
        duration: `${Math.floor(service.duration / 60) > 0 ? `${Math.floor(service.duration / 60)}hr` : ''}${service.duration % 60 ? ` ${service.duration % 60}min` : ''}`,
        description: service.description,
        summary: service.summary,
        createdAt: format(new Date(service.createdAt), 'PPPp'),
        createdBy: service.createdBy,
        updatedAt: format(new Date(service.updatedAt), 'PPPp'),
        updatedBy: service.updatedBy,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="services.xlsx"',
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
