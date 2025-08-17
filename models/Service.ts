import mongoose, { Model } from 'mongoose';

import { getCurrentUserEmail } from '@/lib/auth-helper';
import { ServiceStatus, ServiceType, ServiceTypes } from '@/types/service';

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
      default: 'system-admin@divinely.dev',
    },
    updatedBy: {
      type: String,
      default: 'system-admin@divinely.dev',
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.pre('save', async function (next) {
  const userEmail = await getCurrentUserEmail();
  this.createdBy = userEmail;
  next();
});

serviceSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const userEmail = await getCurrentUserEmail();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: userEmail,
  });
  next();
});

const Service: Model<ServiceType> =
  mongoose.models.Service || mongoose.model<ServiceType>('Service', serviceSchema);

export default Service;
