import mongoose from 'mongoose';

import { ActivityLogType, Status } from '@/services/common/activity/types';

const ActivityLogSchema = new mongoose.Schema<ActivityLogType>(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    schema: {
      type: String,
      required: true,
      enum: ['appointment', 'user', 'drug', 'service'],
    },
    description: { type: String },
    by: {
      uid: { type: String },
      name: { type: String },
      email: { type: String },
      image: { type: String },
    },
    status: { type: String, enum: Object.values(Status) },
    metadata: { type: Object },
    ip: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);

export default ActivityLog;
