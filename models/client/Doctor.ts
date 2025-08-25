import mongoose from 'mongoose';

import { auth } from '@/auth';

const doctorSchema = new mongoose.Schema(
  {
    uid: {
      type: Number,
      required: true,
      unique: true,
    },
    designation: String,
    department: String,
    experience: String,
    education: String,
    patients: Number,
    biography: String,
    shortbio: String,
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

doctorSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const session = await auth();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: session?.user?.email || 'system-admin@divinely.dev',
  });
  next();
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

export default Doctor;
