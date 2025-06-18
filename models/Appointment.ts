import { Gender } from '@/lib/interface';
import {
  AppointmentMode,
  AppointmentStatus,
  AppointmentType,
  AType,
} from '@/types/appointment';
import mongoose, { Model } from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

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
        enum: Gender,
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
        enum: AppointmentMode,
        default: AppointmentMode.offline,
      },
      notes: String,
      symptoms: String,
      description: String,
      instructions: String,
    },
    progress: Number,
    status: {
      type: String,
      default: AppointmentStatus.booked,
      enum: AppointmentStatus,
    },
    data: {
      type: Map,
      of: String,
    },
    type: {
      type: String,
      enum: AType,
      default: AType.consultation,
    },
    previousAppointments: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// @ts-ignore
appointmentSchema.plugin(AutoIncrement, { inc_field: 'aid', start_seq: 1000 });

const Appointment: Model<AppointmentType> =
  mongoose.models.Appointment ||
  mongoose.model<AppointmentType>('Appointment', appointmentSchema);

export default Appointment;
