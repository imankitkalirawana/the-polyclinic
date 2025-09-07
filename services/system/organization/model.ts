import mongoose, { Connection } from 'mongoose';
import { auth } from '@/auth';
import { generateOrganizationId } from '@/services/system/organization/helper';
import client, { getDB } from '@/lib/mongodb';

const organizationSchema = new mongoose.Schema(
  {
    organizationId: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$/,
        'Domain format is invalid',
      ],
    },
    logoUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    subscriptionId: {
      type: String,
      default: null,
    },
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
    collection: 'organization',
  }
);

// Pre-save middleware to set createdBy
organizationSchema.pre('save', async function (next) {
  const session = await auth();
  const organizationId = generateOrganizationId(this.domain);
  this.organizationId = organizationId;
  // create database
  const db = client.db(organizationId);
  await db.createCollection('user');

  this.createdBy = session?.user?.email || 'system-admin@divinely.dev';
  next();
});

// Pre-update middleware to set updatedBy
organizationSchema.pre(['findOneAndUpdate', 'updateOne'], async function (next) {
  const session = await auth();
  this.setUpdate({
    ...this.getUpdate(),
    updatedBy: session?.user?.email || 'system-admin@divinely.dev',
  });
  next();
});

// Post delete middleware to delete database
organizationSchema.pre(['deleteOne', 'findOneAndDelete'], async function (next) {
  const db = await getDB(this.getQuery().organizationId);
  await db.dropDatabase();
  next();
});

export const getOrganizationModel = (conn: Connection) => {
  return conn.models.Organization || conn.model('organization', organizationSchema);
};
