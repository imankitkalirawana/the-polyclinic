import { genders } from '@/types/user';
import { AppointmentType } from '@/types/appointment';
import mongoose, { Model } from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { auth } from '@/auth';

// @ts-ignore
const AutoIncrement = mongooseSequence(mongoose);

const appointmentSchema = new mongoose.Schema(
  {
    aid: {
      type: Number,
      unique: true,
    },
    date: String,
    patient: {
      uid: Number,
      name: String,
      phone: String,
      email: String,
      gender: {
        type: String,
        enum: genders,
      },
      age: Number,
      image: String,
    },
    doctor: {
      uid: Number,
      name: String,
      email: String,
      sitting: String,
      image: String,
    },
    additionalInfo: {
      type: {
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
      enum: [
        'booked',
        'confirmed',
        'in-progress',
        'completed',
        'cancelled',
        'overdue',
        'on-hold',
      ],
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
    previousAppointments: {
      type: [Number],
      default: [],
    },
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

appointmentSchema.pre(
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

// @ts-ignore
appointmentSchema.plugin(AutoIncrement, { inc_field: 'aid', start_seq: 1000 });

const Appointment: Model<AppointmentType> =
  mongoose.models.Appointment ||
  mongoose.model<AppointmentType>('Appointment', appointmentSchema);

export default Appointment;
