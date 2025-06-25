'use server';

import { connectDB } from '@/lib/db';
import Drug from '@/models/Drug';

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
