'use server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function registerUser(data: {
  name: string;
  dob?: {
    day: string;
    month: string;
    year: string;
  };
  id: string;
  password: string;
}) {
  await connectDB();

  if (!data.name || !data.id || !data.password) {
    throw new Error('Please enter all fields');
  }

  let dob;

  if (data.dob) {
    dobFormat(data.dob);
  }

  const existingUser = await User.findOne(
    data.id.includes('@') ? { email: data.id } : { phone: data.id }
  );
  if (existingUser) {
    throw new Error('User already exists');
  }

  data.password = await bcrypt.hash(data.password, 12);

  let user;

  if (data.id.includes('@')) {
    user = (await User.create({ ...data, email: data.id, dob })).toObject();
  } else {
    user = (await User.create({ ...data, phone: data.id, dob })).toObject();
  }
  if (!user) {
    throw new Error('An error occurred');
  }
  return {
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt.toLocaleString(),
    updatedAt: user.updatedAt.toLocaleString()
  };
}

// helper functions

export const dobFormat = (date: {
  day: string;
  month: string;
  year: string;
}) => {
  if (date.day.length === 1) {
    date.day = `0${date.day}`;
  }
  if (date.month.length === 1) {
    date.month = `0${date.month}`;
  }
  return `${date.year}-${date.month}-${date.day}`;
};
