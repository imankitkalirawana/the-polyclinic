import { auth } from '@/auth';
import mongoose, { Connection } from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, 'User ID is required'],
      unique: [true, 'User ID must be unique'],
    },
    designation: String,
    department: String,
    experience: String,
    education: String,
    biography: String,
    shortbio: String,
    seating: String,
  },
  {
    collection: 'doctor',
  }
);

export const getDoctorModel = (conn: Connection) => {
  return conn.models.doctor || conn.model('doctor', doctorSchema);
};

const slotSchema = new mongoose.Schema(
  {
    title: String,
    duration: { type: Number, required: true },
    availability: { type: Object, required: true },
    bufferTime: { type: Number, required: true },
    maxBookingsPerDay: { type: Number },
    guestPermissions: { type: Object, required: true },
    timezone: { type: String, required: true },
    uid: { type: String, required: true },
    createdBy: String,
  },
  { timestamps: true }
);
slotSchema.pre('save', async function (next) {
  const session = await auth();
  this.createdBy = session?.user?.email || 'system-admin@divinely.dev';
  next();
});

slotSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const session = await auth();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: session?.user?.email || 'system-admin@divinely.dev',
  });
  next();
});

export const getSlotModel = (conn: Connection) => {
  return conn.models.slot || conn.model('slot', slotSchema);
};
