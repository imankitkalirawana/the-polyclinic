'use server';

import { connectDB } from '../db';

import ActivityLog from '@/models/Activity';
import { ActivityLogType } from '@/types/activity';

export async function logActivity(
  activity: Omit<ActivityLogType, '_id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const { id, title, schema, description, by, status, metadata, ip, userAgent } = activity;

    await connectDB();
    return await ActivityLog.create({
      id,
      title,
      schema,
      description,
      by: by
        ? {
            uid: by.uid,
            name: by.name,
            email: by.email,
            image: by.image,
          }
        : undefined,
      status,
      metadata,
      ip,
      userAgent,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
