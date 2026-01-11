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

export enum ActivityAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  DELETED = 'DELETED',
  SOFT_DELETED = 'SOFT_DELETED',
}

export enum ActorType {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

export interface ChangedField {
  before: string | number | boolean | null | undefined;
  after: string | number | boolean | null | undefined;
}

export interface Actor {
  id: string;
  name: string;
  email: string;
  image: string;
  type: ActorType;
}

export interface ActivityLogResponse {
  id: string;
  entityType: string;
  entityId: string;
  module: string;
  action: ActivityAction;
  changedFields: Record<string, ChangedField> | null;
  previousData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  description: string | null;
  createdAt: string;
  actor: Actor;
}
