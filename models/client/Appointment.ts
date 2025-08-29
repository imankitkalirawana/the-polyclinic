import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

import { auth } from '@/auth';

// @ts-expect-error - mongoose-sequence is not typed
const AutoIncrement = mongooseSequence(mongoose);

const appointmentSchema = new mongoose.Schema(
  {
    aid: {
      type: Number,
      unique: true,
    },
    date: Date,
    patient: {
      type: Number,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: Number,
      ref: 'Doctor',
    },
    additionalInfo: {
      mode: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
      },
      notes: String,
      symptoms: String,
      description: String,
      instructions: String,
    },
    progress: Number,
    status: {
      type: String,
      default: 'booked',
      enum: ['booked', 'confirmed', 'in-progress', 'completed', 'cancelled', 'overdue', 'on-hold'],
    },
    data: {
      type: Map,
      of: String,
    },
    type: {
      type: String,
      enum: ['consultation', 'follow-up', 'emergency'],
      default: 'consultation',
    },
    previousAppointment: Number,
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

appointmentSchema.pre('save', async function (next) {
  const session = await auth();
  this.createdBy = session?.user?.email || 'system-admin@divinely.dev';
  next();
});

appointmentSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const session = await auth();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: session?.user?.email || 'system-admin@divinely.dev',
  });

  next();
});

// @ts-expect-error - mongoose-sequence is not typed
appointmentSchema.plugin(AutoIncrement, { inc_field: 'aid', start_seq: 1000 });

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default Appointment;
