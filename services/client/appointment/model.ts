import mongoose, { Connection } from 'mongoose';

import { auth } from '@/auth';
import { generateAid } from '@/models/client/Counter';

const appointmentSchema = new mongoose.Schema(
  {
    aid: {
      type: String,
      unique: true,
    },
    date: Date,
    patientId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
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
    updatedBy: String,
  },
  {
    timestamps: true,
    collection: 'appointment',
  }
);

appointmentSchema.pre('save', async function (next) {
  const session = await auth();
  this.aid = await generateAid('aid');
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

export const getAppointmentModel = (conn: Connection) => {
  return conn.models.appointment || conn.model('appointment', appointmentSchema);
};
