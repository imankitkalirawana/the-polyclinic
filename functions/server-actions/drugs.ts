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
    _id: drug._id.toString(),
  }));
};

export const getDrugWithDid = async (did: number) => {
  await connectDB();
  const drug = await Drug.findOne({
    did,
  }).lean();
  if (!drug) {
    throw new Error('Drug not found');
  }
  return {
    ...drug,
    _id: drug?._id.toString(),
  };
};
