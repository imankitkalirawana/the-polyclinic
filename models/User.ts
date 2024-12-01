import { User as IUser, UserRole, UserStatus } from '@/lib/interface';
import mongoose, { Model } from 'mongoose';

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
    phone: String,
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: [true, 'Name is required']
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
    passwordResetToken: String
  },
  {
    timestamps: true
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
