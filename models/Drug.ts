import mongoose, { Model } from 'mongoose';

import { Base } from '@/lib/interface';

export interface DrugType extends Base {
  did: number;
  brandName: string;
  genericName: string;
  description?: string;
  manufacturer?: string;
  dosage?: string;
  form?: string;
  frequency?: string;
  strength?: number;
  quantity?: number;
  price?: number;
  status: 'available' | 'unavailable';
  stock?: number;
}

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
      enum: ['available', 'unavailable'],
      default: 'available',
    },
    stock: Number,
  },
  { timestamps: true }
);

const Drug: Model<DrugType> =
  mongoose.models.Drug || mongoose.model('Drug', drugSchema);

export default Drug;
