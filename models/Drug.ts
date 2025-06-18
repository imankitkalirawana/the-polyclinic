import { DrugStatus, DrugType } from '@/types/drug';
import mongoose, { Model } from 'mongoose';

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
  },
  { timestamps: true }
);

const Drug: Model<DrugType> =
  mongoose.models.Drug || mongoose.model('Drug', drugSchema);

export default Drug;
