import mongoose, { Connection, Model } from 'mongoose';
import { auth } from '@/auth';
import { UserType } from '@/types/user';
import { generateUid } from './Counter';

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
        'Email is invalid',
      ],
    },
    organization: {
      type: String,
    },
    phone: String,
    password: String,
    image: {
      type: String,
      default: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_1.png',
    },
    role: {
      type: String,
      default: 'patient',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked', 'deleted', 'unverified'],
      default: 'unverified',
    },
    updatedBy: {
      type: String,
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

userSchema.pre('save', async function (next) {
  const session = await auth();
  this.uid = await generateUid('uid', this.organization);
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

export const getUserModel = (conn: Connection) => {
  return conn.models.User || conn.model('user', userSchema);
};
