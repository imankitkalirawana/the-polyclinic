import mongoose, { Model } from 'mongoose';

import { Base } from '@/lib/interface';

export enum ServiceStatus {
  active = 'active',
  inactive = 'inactive',
}

export enum ServiceTypes {
  medical = 'medical',
  surgical = 'surgical',
  diagnostic = 'diagnostic',
  consultation = 'consultation',
}

export interface ServiceType extends Base {
  uniqueId: string;
  name: string;
  description: string;
  summary: string;
  price: number;
  duration: number;
  status: ServiceStatus;
  type: ServiceTypes;
  data: Record<string, string>;
  image?: string;
}

const serviceSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      unique: true,
      required: [true, 'Unique ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    summary: String,
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
    },
    image: String,
    status: {
      type: String,
      enum: ServiceStatus,
      default: 'active',
    },
    type: {
      type: String,
      enum: ServiceTypes,
      required: [true, 'Type is required'],
    },
    data: {
      type: Map,
      of: String,
    },
    createdBy: {
      type: String,
      required: [true, 'Created by is required'],
    },
    updatedBy: String,
  },
  {
    timestamps: true,
  }
);

const Service: Model<ServiceType> =
  mongoose.models.Service ||
  mongoose.model<ServiceType>('Service', serviceSchema);

export default Service;
