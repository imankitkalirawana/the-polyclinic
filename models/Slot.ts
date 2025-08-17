import mongoose, { Model } from 'mongoose';

import { getCurrentUserEmail } from '@/lib/auth-helper';
import { Base } from '@/lib/interface';
import { SlotConfig } from '@/types/slots';

interface SlotType extends Base, SlotConfig {}

const SlotSchema = new mongoose.Schema<SlotType>(
  {
    title: { type: String },
    duration: { type: Number, required: true },
    availability: { type: Object, required: true },
    bufferTime: { type: Number, required: true },
    maxBookingsPerDay: { type: Number },
    guestPermissions: { type: Object, required: true },
    timezone: { type: String, required: true },
    uid: { type: Number, required: true },
  },
  { timestamps: true }
);

SlotSchema.pre('save', async function (next) {
  const userEmail = await getCurrentUserEmail();
  this.createdBy = userEmail;
  next();
});

SlotSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const userEmail = await getCurrentUserEmail();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: userEmail,
  });
  next();
});

const Slot: Model<SlotType> = mongoose.models.Slot || mongoose.model<SlotType>('Slot', SlotSchema);

export default Slot;
