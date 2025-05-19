import mongoose from 'mongoose';

export enum Schema {
  APPOINTMENT = 'appointment',
  USER = 'user',
  DRUG = 'drug',
  SERVICE = 'service',
}

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
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ActivityLogSchema = new mongoose.Schema<ActivityLogType>(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    schema: {
      type: String,
      enum: Object.values(Schema),
      required: true,
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
