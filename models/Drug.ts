import mongoose, { Model } from 'mongoose';
import { Base } from '@/lib/interface';

export interface DrugType extends Base {
  did: number;
  genericName: string;
  brandName: string;
  description?: string;
  manufacturer?: string;
  dosage?: string;
  form: string;
  strength?: number;
  quantity?: number;
  price?: number;
  frequency?: string;
}

const drugSchema = new mongoose.Schema<DrugType>(
  {
    did: {
      type: Number,
      unique: true
    },
    genericName: String,
    brandName: String,
    description: String,
    manufacturer: String,
    dosage: String,
    form: String,
    strength: Number,
    quantity: Number,
    price: Number,
    frequency: String
  },
  { timestamps: true }
);

const Drug: Model<DrugType> =
  mongoose.models.Drug || mongoose.model('Drug', drugSchema);

export default Drug;
