// utils/db.js
import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose, { Connection } from 'mongoose';

const uri = process.env.MONGODB_URI || '';

const connections: Record<string, Connection> = {};

export const connectDB = async (subDomain?: string | null) => {
  const dbName = subDomain || process.env.MONGODB_GLOBAL || 'control-plane';

  // Reuse if already connected
  if (connections[dbName]) {
    return connections[dbName];
  }

  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  // Create new connection if not exists
  const conn = await mongoose
    .createConnection(uri, {
      dbName,
    })
    .asPromise();

  connections[dbName] = conn;
  return conn;
};

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default client;

export async function getDB(subDomain?: string | null) {
  await client.connect();
  return client.db(subDomain || process.env.MONGODB_GLOBAL);
}
