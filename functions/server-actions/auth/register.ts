'use server';

import bcrypt from 'bcryptjs';

import { sendHTMLEmail } from '../emails/send-email';

import { CLINIC_INFO } from '@/lib/config';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { WelcomeUser } from '@/utils/email-template/patient/new-user';

export default async function registerUser(data: {
  name: string;
  dob?: {
    day: string;
    month: string;
    year: string;
  };
  id: string;
  password?: string;
  gender?: 'male' | 'female' | 'other';
}) {
  await connectDB();

  if (!data.name || !data.id) {
    throw new Error('Please enter all fields');
  }

  const existingUser = await User.findOne(
    data.id.includes('@') ? { email: data.id } : { phone: data.id }
  );
  if (existingUser) {
    throw new Error('User already exists');
  }

  if (!data.password) {
    data.password = '12345678';
  }

  data.password = await bcrypt.hash(data.password, 12);

  let user;

  if (data.id.includes('@')) {
    user = (await User.create({ ...data, email: data.id })).toObject();
  } else {
    user = (await User.create({ ...data, phone: data.id })).toObject();
  }

  if (data.id.includes('@')) {
    await sendHTMLEmail({
      to: data.id,
      subject: `Welcome to ${CLINIC_INFO.name}`,
      html: WelcomeUser(user),
    });
  }
  if (!user) {
    throw new Error('An error occurred');
  }
  return {
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt.toLocaleString(),
    updatedAt: user.updatedAt.toLocaleString(),
  };
}

export const generatePassword = (length: number) => {
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

export const dobFormat = (date: { day: string; month: string; year: string }) => {
  if (date.day.length === 1) {
    date.day = `0${date.day}`;
  }
  if (date.month.length === 1) {
    date.month = `0${date.month}`;
  }
  return `${date.year}-${date.month}-${date.day}`;
};
