// utils/db.js
import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import mongoose, { Connection } from 'mongoose';

const uri = process.env.MONGODB_URI || '';

// Store connections with metadata
const connections: Record<
  string,
  {
    connection: Connection;
    lastUsed: Date;
    inUse: number;
  }
> = {};

// Connection pool configuration
const CONNECTION_CONFIG = {
  maxPoolSize: 10, // Maximum number of connections in the connection pool
  minPoolSize: 2, // Minimum number of connections in the connection pool
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  serverSelectionTimeoutMS: 5000, // How long to try selecting a server
  socketTimeoutMS: 45000, // How long to wait for a response
};

export const connectDB = async (subDomain?: string | null): Promise<Connection> => {
  const dbName = subDomain || process.env.MONGODB_GLOBAL || 'control-plane';

  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  // Return existing connection if available and healthy
  if (connections[dbName]) {
    const connData = connections[dbName];

    // Check if connection is still alive
    if (connData.connection.readyState === 1) {
      // 1 = connected
      connData.lastUsed = new Date();
      connData.inUse++;

      // Clean up usage counter after some time
      setTimeout(() => {
        if (connections[dbName]) {
          connections[dbName].inUse = Math.max(0, connections[dbName].inUse - 1);
        }
      }, 1000);

      return connData.connection;
    } else {
      // Remove dead connection
      delete connections[dbName];
    }
  }

  console.log('Creating new DB connection for:', dbName);

  try {
    const conn = mongoose.createConnection(uri, {
      dbName,
      ...CONNECTION_CONFIG,
    });

    // Wait for connection to be established
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000); // 10 second timeout

      conn.once('open', () => {
        clearTimeout(timeout);
        resolve();
      });

      conn.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    // Store connection with metadata
    connections[dbName] = {
      connection: conn,
      lastUsed: new Date(),
      inUse: 1,
    };

    // Set up connection event listeners
    conn.on('error', (err) => {
      console.error(`DB connection error for ${dbName}:`, err);
      delete connections[dbName];
    });

    conn.on('disconnected', () => {
      console.log(`DB disconnected for ${dbName}`);
      delete connections[dbName];
    });

    return conn;
  } catch (error) {
    console.error(`Failed to connect to DB ${dbName}:`, error);
    throw error;
  }
};

// Cleanup function to close idle connections
export const cleanupIdleConnections = () => {
  const now = new Date();
  const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  Object.entries(connections).forEach(([dbName, connData]) => {
    const idleTime = now.getTime() - connData.lastUsed.getTime();

    // Close if idle for too long and not currently in use
    if (idleTime > IDLE_TIMEOUT && connData.inUse === 0) {
      console.log(`Closing idle connection for ${dbName}`);
      connData.connection.close();
      delete connections[dbName];
    }
  });
};

// Graceful shutdown function
export const closeAllConnections = async () => {
  const closePromises = Object.entries(connections).map(([dbName, connData]) => {
    console.log(`Closing connection for ${dbName}`);
    return connData.connection.close();
  });

  await Promise.all(closePromises);

  // Clear the connections object
  Object.keys(connections).forEach((key) => delete connections[key]);
};

// Monitor connection health
export const getConnectionStats = () => {
  return Object.entries(connections).map(([dbName, connData]) => ({
    dbName,
    readyState: connData.connection.readyState,
    lastUsed: connData.lastUsed,
    inUse: connData.inUse,
    host: connData.connection.host,
    port: connData.connection.port,
  }));
};

// Set up periodic cleanup (run every 2 minutes)
setInterval(cleanupIdleConnections, 2 * 60 * 1000);

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

export async function getDB(subDomain?: string | null): Promise<Db> {
  await client.connect();
  return client.db(subDomain || process.env.MONGODB_GLOBAL);
}
