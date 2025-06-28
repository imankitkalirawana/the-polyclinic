import { auth } from '@/auth';
import { DoctorType } from '@/types/doctor';
import mongoose, { Model } from 'mongoose';

const doctorSchema = new mongoose.Schema(
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

doctorSchema.pre('save', async function (next) {
  const session = await auth();
  this.createdBy = session?.user?.email || 'system-admin@divinely.dev';
  next();
});

doctorSchema.pre(
  ['findOneAndUpdate', 'updateOne', 'updateMany'],
  async function (next) {
    const session = await auth();
    this.setUpdate({
      ...this.getUpdate(),
      updatedBy: session?.user?.email || 'system-admin@divinely.dev',
    });
    next();
  }
);

const Doctor: Model<DoctorType> =
  mongoose.models.doctors ||
  mongoose.model<DoctorType>('doctors', doctorSchema);

export default Doctor;
