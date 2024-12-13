import { Base } from '@/lib/interface';
import mongoose, { Model } from 'mongoose';

export interface DoctorType extends Base {
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  experience: string;
  education: string;
  patients: number;
  biography: string;
  image: string;
  shortbio: string;
  uid: number;
}

const DoctorSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    designation: String,
    department: String,
    experience: String,
    education: String,
    patients: Number,
    biography: String,
    image: String,
    shortbio: String,
    uid: Number
  },
  {
    timestamps: true
  }
);

const Doctor: Model<DoctorType> =
  mongoose.models.doctors ||
  mongoose.model<DoctorType>('doctors', DoctorSchema);

export default Doctor;
