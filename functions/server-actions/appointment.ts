'use server';

import { connectDB } from '@/lib/db';
import { sendHTMLMail, sendMail } from '@/lib/functions';
import Appointment from '@/models/Appointment';
import { RescheduledAppointment } from '@/utils/email-template/patient';

export const getAllAppointments = async () => {
  await connectDB();
  const appointments = await Appointment.find().lean();

  return appointments.map((appointment) => ({
    ...appointment,
    _id: appointment._id.toString()
  }));
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
      sendHTMLMail(
        appointment.patient.email,
        'Appointment Rescheduled',
        RescheduledAppointment(appointment, previousDate as Date)
      ).catch((error) => {
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
      await sendMail(
        appointment.patient.email,
        'Appointment Status',
        'Your appointment is overdue'
      );
    });
  }
};
