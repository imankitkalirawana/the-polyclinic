'use server';

import { connectDB } from '@/lib/db';
import Drug from '@/models/Drug';

export const getAllDrugs = async () => {
  await connectDB();
  const drugs = await Drug.find()
    .select('brandName genericName frequency did')
    .lean();
  return drugs.map((drug) => ({
    ...drug,
    _id: drug._id.toString()
  }));
};
