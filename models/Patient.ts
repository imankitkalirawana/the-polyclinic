import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

import { getCurrentUserEmail } from '@/lib/auth-helper';

// @ts-expect-error - mongoose-sequence is not typed
const AutoIncrement = mongooseSequence(mongoose);

const patientSchema = new mongoose.Schema(
  {
    pid: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    dob: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    phone: {
      type: String,
      required: true,
    },
    email: String,
    address: String,
    city: String,
    state: String,
    country: String,
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

// @ts-expect-error - mongoose-sequence is not typed
patientSchema.plugin(AutoIncrement, { inc_field: 'pid', start_seq: 1 });

patientSchema.pre('save', async function (next) {
  const userEmail = await getCurrentUserEmail();
  this.createdBy = userEmail;
  next();
});

patientSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const userEmail = await getCurrentUserEmail();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: userEmail,
  });
  next();
});
