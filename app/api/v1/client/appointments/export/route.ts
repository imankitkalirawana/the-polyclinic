import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';

import { connectDB } from '@/lib/db';
import { withAuth } from '@/middleware/withAuth';
import { getSubdomain } from '@/auth/sub-domain';
import { validateOrganizationId } from '@/lib/server-actions/validation';
import { getAppointmentModel } from '@/services/client/appointment';

export const POST = withAuth(async (request: NextAuthRequest) => {
  try {
    const subdomain = await getSubdomain();

    const doesOrganizationExist = await validateOrganizationId(subdomain);

    if (!doesOrganizationExist) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 404 });
    }

    const conn = await connectDB(subdomain);
    const Appointment = getAppointmentModel(conn);

    const { keys } = await request.json();

    await connectDB();
    const appointments = await Appointment.find(
      keys && keys.length > 0 && keys[0] !== -1 ? { aid: { $in: keys } } : {}
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Appointments');
    worksheet.columns = [
      { header: 'Appointment ID', key: 'aid', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Patient ID', key: 'patientId', width: 10 },
      { header: 'Patient Name', key: 'patientName', width: 20 },
      { header: 'Patient Email', key: 'patientEmail', width: 30 },
      { header: 'Patient Phone', key: 'patientPhone', width: 20 },
      { header: 'Patient Gender', key: 'patientGender', width: 20 },
      { header: 'Patient Age', key: 'patientAge', width: 20 },
      { header: 'Doctor ID', key: 'doctorId', width: 10 },
      { header: 'Doctor Name', key: 'doctorName', width: 20 },
      { header: 'Doctor Email', key: 'doctorEmail', width: 30 },
      { header: 'Doctor Seating', key: 'doctorSeating', width: 20 },
      { header: 'Date', key: 'date', width: 30 },

      { header: 'Created At', key: 'createdAt', width: 40 },
      { header: 'Created By', key: 'createdBy', width: 30 },
      { header: 'Updated At', key: 'updatedAt', width: 40 },
      { header: 'Updated By', key: 'updatedBy', width: 30 },
    ];

    appointments.forEach((appointment) => {
      worksheet.addRow({
        aid: appointment.aid,
        status: appointment.status,
        patientId: appointment.patient.uid,
        patientName: appointment.patient.name,
        patientEmail: appointment.patient.email,
        patientPhone: appointment.patient.phone,
        patientGender: appointment.patient.gender,
        patientAge: appointment.patient.age,
        doctorId: appointment.doctor?.uid || '',
        doctorName: appointment.doctor?.name,
        doctorEmail: appointment.doctor?.email,
        doctorSeating: appointment.doctor?.seating,
        date: format(new Date(appointment.date), 'PPPp'),
        createdAt: format(new Date(appointment.createdAt), 'PPPp'),
        createdBy: appointment.createdBy,
        updatedAt: format(new Date(appointment.updatedAt), 'PPPp'),
        updatedBy: appointment.updatedBy,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="appointments.xlsx"',
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
