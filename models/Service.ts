import {
  ServiceStatus,
  ServiceType,
  Service as ServiceInterface
} from '@/lib/interface';
import mongoose, { Model } from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      unique: true,
      required: [true, 'Unique ID is required']
    },
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    summary: String,
    price: {
      type: Number,
      required: [true, 'Price is required']
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required']
    },
    image: String,
    status: {
      type: String,
      enum: ServiceStatus,
      default: 'active'
    },
    type: {
      type: String,
      enum: ServiceType,
      required: [true, 'Type is required']
    },
    data: {
      type: Map,
      of: String
    },
    createdBy: {
      type: String,
      required: [true, 'Created by is required']
    },
    updatedBy: String
  },
  {
    timestamps: true
  }
);

const Service: Model<ServiceInterface> =
  mongoose.models.Service ||
  mongoose.model<ServiceInterface>('Service', serviceSchema);

export default Service;
