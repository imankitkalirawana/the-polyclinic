import mongoose from 'mongoose';

export type Schema = 'appointment' | 'user' | 'drug' | 'service';

export enum Status {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export interface ActivityLogType {
  _id: string;
  id: number;
  title: string;
  schema: Schema;
  description?: string;
  by?: {
    uid: string;
    name: string;
    email: string;
    image: string;
  };
  status?: Status;
  metadata?: {
    fields?: string[];
    diff?: Record<string, { old: any; new: any }>;
  };
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt?: Date;
}

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

const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model('ActivityLog', ActivityLogSchema);

export default ActivityLog;
