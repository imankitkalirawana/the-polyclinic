'use server';

import { getSubdomain } from '@/auth/sub-domain';
import client from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function registerUser(data: {
  name: string;
  email: string;
  password?: string;
}) {
  await client.connect();
  const subDomain = await getSubdomain();
  if (!subDomain) return { error: 'Organization is required' };

  const db = client.db(subDomain);
  const collections = await db.listCollections().toArray();
  if (collections.length === 0) {
    return { error: 'Organization does not exist' };
  }

  const hashedPassword = await bcrypt.hash(data.password || '', 10);
  const res = await db.collection('user').insertOne({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: 'patient',
    organization: subDomain,
  });

  if (!res.acknowledged) {
    return { error: 'Failed to register user' };
  }

  return { success: true };
}

export const generatePassword = async (length: number) => {
  // show contain at least one number, one lowercase, one uppercase and one special character
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// helper functions

export const dobFormat = async (date: { day: string; month: string; year: string }) => {
  if (date.day.length === 1) {
    date.day = `0${date.day}`;
  }
  if (date.month.length === 1) {
    date.month = `0${date.month}`;
  }
  return `${date.year}-${date.month}-${date.day}`;
};
