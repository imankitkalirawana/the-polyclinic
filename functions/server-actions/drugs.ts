'use server';

import { connectDB } from '@/lib/db';
import Drug from '@/models/Drug';

export const getAllDrugs = async () => {
  await connectDB();
  const drugs = await Drug.find().lean();

  return drugs.map((drug) => ({
    ...drug,
    _id: drug._id.toString()
  }));
};
