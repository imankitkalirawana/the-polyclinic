// utils/db.js
import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || '';

const connectDB = async (subDomain?: string | null) => {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  try {
    await mongoose.connect(uri, {
      dbName: subDomain || process.env.MONGODB_GLOBAL,
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export { connectDB };

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
