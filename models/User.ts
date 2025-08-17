import mongoose, { Model } from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { getCurrentUserEmail } from '@/lib/auth-helper';
import { userRoles, userStatuses, UserType } from '@/types/user';

// @ts-expect-error - mongoose-sequence is not typed
const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: Number,
      unique: true,
    },
    name: String,
    email: String,
    phone: String,
    password: String,
    image: String,
    role: {
      type: String,
      enum: userRoles,
      default: 'patient',
    },
    status: {
      type: String,
      enum: userStatuses,
      default: 'unverified',
    },
    passwordResetToken: String,
    updatedBy: {
      type: String,
      default: 'system-admin@divinely.dev',
    },
    createdBy: {
      type: String,
      default: 'system-admin@divinely.dev',
    },
  },
  {
    timestamps: true,
    collection: 'user',
  }
);

// @ts-expect-error - mongoose-sequence is not typed
userSchema.plugin(AutoIncrement, { inc_field: 'uid', start_seq: 1 });

userSchema.pre('save', async function (next) {
  const userEmail = await getCurrentUserEmail();
  this.createdBy = userEmail;
  next();
});

userSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const userEmail = await getCurrentUserEmail();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: userEmail,
  });
  next();
});

const User: Model<UserType> = mongoose.models.User || mongoose.model<UserType>('User', userSchema);
export default User;
