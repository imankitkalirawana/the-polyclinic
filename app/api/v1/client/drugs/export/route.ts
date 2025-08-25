import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';

import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Drug from '@/models/Drug';

export const GET = auth(async (request: NextAuthRequest) => {
  try {
    if (request.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const drugs = await Drug.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Drugs');
    worksheet.columns = [
      { header: 'Drug ID', key: 'did', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Brand Name', key: 'brandName', width: 20 },
      { header: 'Generic Name', key: 'genericName', width: 20 },
      { header: 'Manufacturer', key: 'manufacturer', width: 20 },
      { header: 'Dosage', key: 'dosage', width: 20 },
      { header: 'Price (INR)', key: 'price', width: 10 },
      { header: 'Strength (mg)', key: 'strength', width: 20 },
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 30 },
      { header: 'Created By', key: 'createdBy', width: 30 },
      { header: 'Updated At', key: 'updatedAt', width: 30 },
      { header: 'Updated By', key: 'updatedBy', width: 30 },
    ];

    drugs.forEach((drug) => {
      worksheet.addRow({
        did: drug.did,
        status: drug.status,
        brandName: drug.brandName,
        genericName: drug.genericName,
        manufacturer: drug.manufacturer || '-',
        dosage: drug.dosage || '-',
        strength: drug.strength || '-',
        stock: drug.stock || '-',
        price: drug?.price?.toLocaleString('en-IN') || '-',
        createdAt: format(new Date(drug.createdAt), 'PPPp'),
        createdBy: drug.createdBy,
        updatedAt: format(new Date(drug.updatedAt), 'PPPp'),
        updatedBy: drug.updatedBy,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="drugs.xlsx"',
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
