'use server';

import { SortDescriptor } from '@heroui/react';

import { connectDB } from '@/lib/db';
import Service from '@/models/Service';

export const getAllServices = async (options?: {
  limit?: number;
  page?: number;
  query?: string;
  sort?: SortDescriptor;
}) => {
  const limit = options?.limit || 25;
  const page = options?.page || 1;
  const query = options?.query || '';
  const sort = options?.sort || { column: 'name', direction: 'ascending' };

  const searchQuery = {
    ...(query
      ? {
          $or: [
            { name: { $regex: new RegExp(query.trim(), 'ig') } },
            { email: { $regex: new RegExp(query.trim(), 'ig') } },
            { phone: { $regex: new RegExp(query.trim(), 'ig') } },
            { designation: { $regex: new RegExp(query.trim(), 'ig') } },
            { designation: { $regex: new RegExp(query.trim(), 'ig') } },
            { department: { $regex: new RegExp(query.trim(), 'ig') } },
            { sitting: { $regex: new RegExp(query.trim(), 'ig') } },
            { status: { $regex: new RegExp(query.trim(), 'ig') } },
            { uid: isNaN(parseInt(query)) ? undefined : parseInt(query, 10) },
          ].filter(Boolean) as any[],
        }
      : {}),
  };

  await connectDB();

  const sortObject: Record<string, 1 | -1> = {
    [sort.column]: (sort.direction === 'ascending' ? 1 : -1) as 1 | -1,
  };

  const services = await Service.find(searchQuery)
    .sort(sortObject)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()
    .catch((error) => {
      throw new Error(error.message);
    });

  const total = await Service.countDocuments(searchQuery);

  const totalPages = Math.ceil(total / limit);

  // Convert _id to string
  const formattedAppointments = services.map((service) => {
    return {
      ...service,
      _id: service._id.toString(),
    };
  });

  return {
    services: formattedAppointments,
    total,
    totalPages,
  };
};
