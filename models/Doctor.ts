import { DoctorType } from '@/types/doctor';
import mongoose, { Model } from 'mongoose';

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
    uid: Number,
    seating: String,
  },
  {
    timestamps: true,
  }
);

const Doctor: Model<DoctorType> =
  mongoose.models.doctors ||
  mongoose.model<DoctorType>('doctors', DoctorSchema);

export default Doctor;
