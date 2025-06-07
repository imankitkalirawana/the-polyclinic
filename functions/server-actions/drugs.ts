'use server';

import { connectDB, disconnectDB } from '@/lib/db';
import Drug from '@/models/Drug';

export const getAllDrugs = async () => {
  try {
    await connectDB();
    const drugs = await Drug.find()
      .select('brandName genericName frequency did')
      .lean();
  return drugs.map((drug) => ({
    ...drug,
    _id: drug._id.toString(),
  }));
  } finally {
    await disconnectDB();
  }
};

export const getDrugWithDid = async (did: number) => {
  try {
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
  } finally {
    await disconnectDB();
  }
};
