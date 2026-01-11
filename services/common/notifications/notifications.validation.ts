import { z } from 'zod';
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUSES,
  NOTIFICATION_PRIORITIES,
} from './notifications.constants';

export const createNotificationSchema = z.object({
  uid: z.string().min(1, { message: 'UID is required' }),
  type: z.enum(NOTIFICATION_TYPES, {
    message: 'Invalid notification type',
  }),
  message: z
    .string()
    .min(1, { message: 'Message is required' })
    .max(500, { message: 'Message must be less than 500 characters' }),
  title: z.string().max(100, { message: 'Title must be less than 100 characters' }).optional(),
  actionLink: z.string().optional().or(z.literal('')),
  status: z.enum(NOTIFICATION_STATUSES).default('unread'),
  priority: z.enum(NOTIFICATION_PRIORITIES).default('medium').optional(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const updateNotificationSchema = z.object({
  status: z.enum(NOTIFICATION_STATUSES).optional(),
  readAt: z.date().optional(),
});

export const markAsReadSchema = z.object({
  notificationIds: z
    .array(z.string())
    .min(1, { message: 'At least one notification ID is required' }),
});

export const getNotificationsQuerySchema = z.object({
  status: z.enum(NOTIFICATION_STATUSES).optional(),
  type: z.enum(NOTIFICATION_TYPES).optional(),
  limit: z.coerce.number().positive().max(100).default(50).optional(),
  offset: z.coerce.number().nonnegative().default(0).optional(),
});
