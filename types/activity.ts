import { $FixMe } from '@/types';

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
    diff?: Record<string, { old: $FixMe; new: $FixMe }>;
  };
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt?: Date;
}
