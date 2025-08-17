import mongoose, { Model } from 'mongoose';

import { getCurrentUserEmail } from '@/lib/auth-helper';
import { DrugStatus, DrugType } from '@/types/drug';

const drugSchema = new mongoose.Schema<DrugType>(
  {
    did: {
      type: Number,
      unique: true,
    },
    brandName: String,
    genericName: String,
    description: String,
    manufacturer: String,
    dosage: String,
    form: String,
    strength: Number,
    quantity: Number,
    price: Number,
    frequency: String,
    status: {
      type: String,
      enum: DrugStatus,
      default: DrugStatus.available,
    },
    stock: Number,
    createdBy: {
      type: String,
      default: 'system-admin@divinely.dev',
    },
    updatedBy: {
      type: String,
      default: 'system-admin@divinely.dev',
    },
  },
  { timestamps: true }
);

drugSchema.pre('save', async function (next) {
  const userEmail = await getCurrentUserEmail();
  this.createdBy = userEmail;
  next();
});

drugSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const userEmail = await getCurrentUserEmail();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: userEmail,
  });

  next();
});

const Drug: Model<DrugType> = mongoose.models.Drug || mongoose.model('Drug', drugSchema);

export default Drug;
