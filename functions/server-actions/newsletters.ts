'use server';

import { connectDB } from '@/lib/db';
import Newsletter from '@/models/Newsletter';

export const getAllNewsletters = async () => {
  await connectDB();
  // Add 3 second delay
  const newsletters = await Newsletter.find().lean();

  return newsletters.map((newsletter: any) => ({
    ...newsletter,
    _id: newsletter._id.toString(),
  }));
};
