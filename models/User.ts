import mongoose, { Model } from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

import { Base, Gender } from '@/lib/interface';

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
  blocked = 'blocked',
  deleted = 'deleted',
  unverified = 'unverified',
}

export enum UserRole {
  admin = 'admin',
  doctor = 'doctor',
  nurse = 'nurse',
  receptionist = 'receptionist',
  pharmacist = 'pharmacist',
  laboratorist = 'laboratorist',
  user = 'user',
}

export interface UserType extends Base {
  uid: number;
  email: string;
  date: string | Date;
  phone: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  additionalInfo: {
    notes?: string;
    symptoms?: string;
    type: UserRole;
    description?: string;
    instructions?: string;
  };
  country: string;
  state: string;
  city: string;
  address: string;
  zipcode: string;
  passwordResetToken: string;
  dob: string;
  gender: Gender;
  image: string;
}

export interface AuthUser {
  user?: {
    name: string;
    email: string;
    role: UserRole;
    date: string | Date;
    id: string;
    uid: number;
    image: string;
  };
  expires?: string;
}

// @ts-ignore
const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
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
