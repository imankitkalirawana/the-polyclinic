'use server';

import { SortDescriptor } from '@heroui/react';

import { connectDB } from '@/lib/db';
import User, { UserType } from '@/models/User';

// get all patients
export const getAllPatients = async () => {
  await connectDB();
  const users = await User.find({ role: 'user' }).select('-password').lean();
  return users.map((user) => ({
    ...user,
    _id: user._id.toString(),
  }));
};

// get all patients with specific email

export const getAllPatientsWithEmail = async (email: string) => {
  await connectDB();
  let user = await User.findOne({ email }).select('phone').lean();
  if (!user) {
    throw new Error('User not found');
  }

  let users = await User.find(user?.phone ? { phone: user.phone } : { email })
    .select('-password')
    .lean();

  return users.map((user) => ({
    ...user,
    _id: user._id.toString(),
  })) as UserType[];
};

// get patient with UID

export const getPatientWithUID = async (uid: number) => {
  await connectDB();
  const user = await User.findOne({
    uid,
  }).lean();
  if (!user) {
    throw new Error('User not found');
  }
  return {
    ...user,
    _id: user?._id.toString(),
  };
};

// get all users
export const getAllUsers = async (options?: {
  limit?: number;
  page?: number;
  status?: string[];
  query?: string;
  sort?: SortDescriptor;
}) => {
  const limit = options?.limit || 25;
  const page = options?.page || 1;
  const status = options?.status || ['all']; // all, active, inactive, blocked, unverified
  const query = options?.query || '';
  const sort = options?.sort || { column: 'name', direction: 'ascending' };

  const searchQuery = {
    ...(query
      ? {
          $or: [
            { name: { $regex: new RegExp(query.trim(), 'ig') } },
            { email: { $regex: new RegExp(query.trim(), 'ig') } },
            { phone: { $regex: new RegExp(query.trim(), 'ig') } },
            { status: { $regex: new RegExp(query.trim(), 'ig') } },
            { uid: isNaN(parseInt(query)) ? undefined : parseInt(query, 10) },
          ].filter(Boolean) as any[],
        }
      : {}),
    ...(status.length && !status.includes('all')
      ? { status: { $in: status } }
      : {}),
  };

  await connectDB();

  // Build the sort object dynamically
  const sortObject: Record<string, 1 | -1> = {
    [sort.column]: (sort.direction === 'ascending' ? 1 : -1) as 1 | -1,
  };

  const users = await User.find(searchQuery)
    .sort(sortObject) // Apply dynamic sorting
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()
    .catch((error) => {
      throw new Error(error.message);
    });

  const total = await User.countDocuments(searchQuery);

  const totalPages = Math.ceil(total / limit);

  // Convert _id to string
  const formattedAppointments = users.map((user) => {
    return {
      ...user,
      _id: user._id.toString(),
    };
  });

  return {
    users: formattedAppointments,
    total,
    totalPages,
  };
};
