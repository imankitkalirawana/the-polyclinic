'use server';

import { connectDB } from '@/lib/db';
import Email from '@/models/Email';

export const getAllEmails = async () => {
  await connectDB();
  // Add 3 second delay
  const emails = await Email.find().lean();

  return emails.map((email: any) => ({
    ...email,
    _id: email._id.toString()
  }));
};
