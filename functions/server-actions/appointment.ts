'use server';

import { connectDB } from '@/lib/db';
import Appointment, { AppointmentType } from '@/models/Appointment';
import { RescheduledAppointment } from '@/utils/email-template/patient';
import { sendHTMLEmail } from './emails/send-email';
import { SortDescriptor } from '@heroui/react';

export const getAllAppointments = async (options?: {
  limit?: number;
  page?: number;
  status?: string[];
  query?: string;
  sort?: SortDescriptor;
}) => {
  const limit = options?.limit || 25;
  const page = options?.page || 1;
  const status = options?.status || ['all']; //can be  'booked', 'confirmed', 'in-progress', 'completed', 'cancelled', 'overdue', 'on-hold'
  const query = options?.query || '';
  const sort = options?.sort || { column: 'date', direction: 'ascending' }; // Default sorting by "date" in ascending order

  const searchQuery = {
    ...(query
      ? {
          $or: [
            { 'patient.name': { $regex: new RegExp(query.trim(), 'ig') } },
            { 'patient.email': { $regex: new RegExp(query.trim(), 'ig') } },
            { 'patient.phone': { $regex: new RegExp(query.trim(), 'ig') } },
            { 'doctor.name': { $regex: new RegExp(query.trim(), 'ig') } },
            { status: { $regex: new RegExp(query.trim(), 'ig') } },
            { aid: isNaN(parseInt(query)) ? undefined : parseInt(query, 10) },
            { date: { $regex: new RegExp(query.trim(), 'ig') } }
          ].filter(Boolean) as any[]
        }
      : {}),
    ...(status.length && !status.includes('all')
      ? { status: { $in: status } }
      : {})
  };

  await connectDB();

  // Build the sort object dynamically
  const sortObject: Record<string, 1 | -1> = {
    [sort.column]: (sort.direction === 'ascending' ? 1 : -1) as 1 | -1
  };

  const appointments = await Appointment.find(searchQuery)
    .sort(sortObject) // Apply dynamic sorting
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()
    .catch((error) => {
      throw new Error(error.message);
    });

  const total = await Appointment.countDocuments(searchQuery);

  const totalPages = Math.ceil(total / limit);

  // Convert _id to string
  const formattedAppointments = appointments.map((appointment) => {
    return {
      ...appointment,
      _id: appointment._id.toString()
    };
  });

  return {
    appointments: formattedAppointments,
    total,
    totalPages
  };
};

export const getAppointmentWithAID = async (aid: number) => {
  await connectDB();
  const appointment = await Appointment.findOne({
    aid
  }).lean();
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  return {
    ...appointment,
    _id: appointment?._id.toString()
  };
};

export const rescheduleAppointment = async (aid: number, date: string) => {
  await connectDB();
  const previousAppointment = await Appointment.findOne({ aid })
    .select('date aid')
    .lean();
  const previousDate = previousAppointment?.date;
  const appointment = await Appointment.findOneAndUpdate(
    { aid },
    { date },
    { new: true }
  );
  if (!appointment) {
    throw new Error('Appointment not found');
  } else {
    const emailTasks = [
      sendHTMLEmail({
        to: appointment.patient.email,
        subject: 'Appointment Rescheduled',
        html: RescheduledAppointment(appointment, previousDate as any)
      }).catch((error) => {
        console.error(error);
      })
    ];

    Promise.all(emailTasks).catch((error) => {
      console.error('Error in email sending:', error);
    });

    return true;
  }
};

// over due appointments

export const overdueAppointments = async () => {
  // find appointments that are in past and status is not overdue, cancelled or completed
  await connectDB();
  const appointments = await Appointment.find({
    date: { $lt: new Date().toISOString() },
    status: { $nin: ['overdue', 'cancelled', 'completed'] }
  }).lean();

  for (const appointment of appointments) {
    await Appointment.findOneAndUpdate(
      { aid: appointment.aid },
      { status: 'overdue' },
      { new: true }
    ).then(async () => {
      await sendHTMLEmail({
        to: appointment.patient.email,
        subject: 'Appointment Status',
        html: 'Your appointment is overdue'
      });
    });
  }
};
