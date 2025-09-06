import { auth } from '@/auth';
import { GENDERS } from '@/lib/constants';
import mongoose, { Connection } from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
    },
    gender: {
      type: String,
      enum: GENDERS,
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    address: String,
    updatedBy: String,
    createdBy: {
      type: String,
      default: 'system-admin@divinely.dev',
    },
  },
  { timestamps: true, collection: 'patient' }
);

patientSchema.pre('save', async function (next) {
  const session = await auth();
  this.createdBy = session?.user?.email ?? 'system-admin@divinely.dev';
  next();
});

patientSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const session = await auth();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: session?.user?.email || 'system-admin@divinely.dev',
  });
  next();
});

export const getPatientModel = (conn: Connection) => {
  return conn.models.patient || conn.model('patient', patientSchema);
};
