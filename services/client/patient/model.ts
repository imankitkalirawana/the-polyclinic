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

export const getPatientModel = (conn: Connection) => {
  return conn.models.patient || conn.model('patient', patientSchema);
};
