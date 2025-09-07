import mongoose, { Connection } from 'mongoose';
import { auth } from '@/auth';
import { generateUid } from '@/models/client/Counter';
import { UNIFIED_USER_ROLES, USER_STATUSES } from './constants';
import { getGravatar } from '@/lib/utils';

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name must be less than 50 characters long'],
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
    },
    role: {
      type: String,
      enum: UNIFIED_USER_ROLES,
    },
    status: {
      type: String,
      enum: USER_STATUSES,
      default: 'active',
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
  // if image is not set, set it to the gravatar
  if (!this.image && this.email) {
    this.image = getGravatar(this.email);
  }
  next();
});

userSchema.pre(['findOneAndUpdate', 'updateOne'], async function (next) {
  const session = await auth();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: session?.user?.email || 'system-admin@divinely.dev',
  });

  next();
});

export const getUserModel = (conn: Connection) => {
  return conn.models.user || conn.model('User', userSchema);
};
