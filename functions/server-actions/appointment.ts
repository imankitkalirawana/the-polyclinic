'use server';

import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';

export const getAppointmentWithAID = async (aid: number) => {
  await connectDB();
  const appointment = await Appointment.findOne({
    aid,
  }).lean();
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  return {
    ...appointment,
    _id: appointment?._id.toString(),
  };
};
