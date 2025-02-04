'use server';

import { connectDB } from '@/lib/db';
import Service from '@/models/Service';

export const getAllServices = async () => {
  await connectDB();
  const services = await Service.find().lean();

  return services.map((service: any) => ({
    ...service,
    _id: service._id.toString()
  }));
};
