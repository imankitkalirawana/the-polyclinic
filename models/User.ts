import { Gender } from '@/lib/interface';
import { UserRole, UserStatus, UserType } from '@/types/user';
import mongoose, { Model } from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

// @ts-ignore
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
      enum: Gender,
    },
    role: {
      type: String,
      enum: UserRole,
      default: UserRole.user,
    },
    status: {
      type: String,
      enum: UserStatus,
      default: UserStatus.unverified,
    },
    additionalInfo: {
      type: {
        type: String,
        enum: UserRole,
        default: UserRole.user,
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
    updatedBy: String,
    createdBy: String,
    image: {
      type: String,
      default: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_1.png',
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// @ts-ignore
userSchema.plugin(AutoIncrement, { inc_field: 'uid', start_seq: 1000 });

const User: Model<UserType> =
  mongoose.models.User || mongoose.model<UserType>('User', userSchema);
export default User;
