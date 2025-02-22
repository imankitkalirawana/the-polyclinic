'use server';

import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';

export const getAllDoctors = async () => {
  await connectDB();
  const doctors = await Doctor.find().select('-password').lean();

  return doctors.map((doctor) => ({
    ...doctor,
    _id: doctor._id.toString()
  }));
};
