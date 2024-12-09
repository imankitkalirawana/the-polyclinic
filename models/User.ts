import { User as IUser, UserRole, UserStatus } from '@/lib/interface';
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
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email is invalid'
      ]
    },
    uid: {
      type: Number,
      unique: true
    },
    phone: String,
    password: {
      type: String,
      default: 'secure_password123'
    },
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    dob: {
      type: String,
      default: '2000-01-01'
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male'
    },
    role: {
      type: String,
      enum: UserRole,
      default: 'user'
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'active'
    },
    country: {
      type: String,
      default: 'IN'
    },
    state: {
      type: String,
      default: 'MH'
    },
    city: String,
    address: String,
    zipcode: String,
    passwordResetToken: String,
    updatedBy: String,
    createdBy: String
  },
  {
    timestamps: true
  }
);

// @ts-ignore
userSchema.plugin(AutoIncrement, { inc_field: 'uid', start_seq: 1000 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
