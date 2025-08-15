import mongoose, { Model } from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { auth } from '@/auth';
import { UserType } from '@/types/user';

// @ts-expect-error - mongoose-sequence is not typed
const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
        'Email is invalid',
      ],
    },
    date: String,
    uid: {
      type: Number,
      unique: true,
    },
    phone: String,
    password: String,
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    dob: String,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    image: {
      type: String,
      default: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_1.png',
    },
    role: {
      type: String,
      enum: ['admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'laboratorist', 'user'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked', 'deleted', 'unverified'],
      default: 'unverified',
    },
    additionalInfo: {
      type: {
        type: String,
        enum: ['consultation', 'test', 'medication', 'surgery'],
        default: 'consultation',
      },
      notes: String,
      symptoms: String,
      description: String,
      instructions: String,
    },
    country: {
      type: String,
      default: 'IN',
    },
    state: {
      type: String,
      default: 'MH',
    },
    city: String,
    address: String,
    zipcode: String,
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
    collection: 'users',
  }
);

// @ts-expect-error - mongoose-sequence is not typed
userSchema.plugin(AutoIncrement, { inc_field: 'uid', start_seq: 1000 });

userSchema.pre('save', async function (next) {
  const session = await auth();
  this.createdBy = session?.user?.email || 'system-admin@divinely.dev';
  next();
});

userSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const session = await auth();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: session?.user?.email || 'system-admin@divinely.dev',
  });
  next();
});

const User: Model<UserType> = mongoose.models.User || mongoose.model<UserType>('User', userSchema);
export default User;
