'use server';

import { connectDB } from '@/lib/db';
import Email from '@/models/Email';
import { EmailType } from '@/types/email';

export const getAllEmails = async () => {
  await connectDB();
  // Add 3 second delay
  const emails = await Email.find().lean();

  return emails.map((email: any) => ({
    ...email,
    _id: email._id.toString(),
  }));
};

export const getEmailWithID = async (id: string): Promise<EmailType> => {
  let email = (await Email.findById(id).lean()) as unknown as EmailType;
  if (!email) {
    throw new Error('Email not found');
  }

  return {
    ...email,
    _id: email._id.toString(),
  };
};
