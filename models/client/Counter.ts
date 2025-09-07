import { getSubdomain } from '@/auth/sub-domain';
import { connectDB } from '@/lib/db';
import mongoose, { Connection } from 'mongoose';

const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  {
    collection: 'counters',
  }
);

export const getCounterModel = (conn: Connection) => {
  return conn.models.Counter || conn.model('counter', counterSchema);
};

export const generateUid = async (id: string, dbName?: string | null) => {
  if (!id) {
    throw new Error('Id is required');
  }

  const conn = await connectDB(dbName);
  const Counter = getCounterModel(conn);
  const counter = await Counter.findOneAndUpdate(
    { _id: id },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return dbName ? `${dbName.toUpperCase()}-${counter.seq}` : `${counter.seq}`;
};

export const generateAid = async (aid: string) => {
  if (!aid) {
    throw new Error('Aid is required');
  }

  const subdomain = await getSubdomain();

  const conn = await connectDB(subdomain);
  const Counter = getCounterModel(conn);
  const counter = await Counter.findOneAndUpdate(
    { _id: aid },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `APT-${counter.seq}`;
};
