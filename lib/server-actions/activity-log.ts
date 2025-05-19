'use server';

import ActivityLog, {
  ActivityLogType,
  Schema,
  Status,
} from '@/models/Activity';

export async function logActivity(
  activity: Omit<ActivityLogType, '_id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const {
      id,
      title,
      schema,
      description,
      by,
      status,
      metadata,
      ip,
      userAgent,
    } = activity;

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
