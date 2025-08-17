import mongoose from 'mongoose';

import { getCurrentUserEmail } from '@/lib/auth-helper';

const doctorSchema = new mongoose.Schema(
  {
    did: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
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
  const userEmail = await getCurrentUserEmail();
  this.createdBy = userEmail;
  next();
});

doctorSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const userEmail = await getCurrentUserEmail();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: userEmail,
  });
  next();
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

export default Doctor;
