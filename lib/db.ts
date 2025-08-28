// utils/db.ts
import mongoose, { Connection } from 'mongoose';

const uri = process.env.MONGODB_URI || '';
if (!uri) throw new Error('MONGODB_URI is not set');

// Store connections (one per tenant DB)
const connections: Record<string, Promise<Connection>> = {};

// Connection pool configuration
const CONNECTION_CONFIG = {
  maxPoolSize: 10, // Max connections per pool
  minPoolSize: 1, // Keep at least 1 idle
  maxIdleTimeMS: 30000, // 30s idle timeout
  serverSelectionTimeoutMS: 5000, // Fail fast
  socketTimeoutMS: 45000,
};

/**
 * Get or create a DB connection for a tenant.
 * Each tenant (subdomain) has its own DB.
 */
export async function connectDB(subDomain?: string | null): Promise<Connection> {
  const dbName = subDomain || process.env.MONGODB_GLOBAL || 'control-plane';

  // If already connecting/connected, return same promise
  if (connections[dbName]) {
    return connections[dbName];
  }

  // Create new connection (per DB)
  const connPromise = mongoose
    .createConnection(uri, {
      dbName,
      ...CONNECTION_CONFIG,
    })
    .asPromise();

  // Cache it immediately (prevents race conditions)
  connections[dbName] = connPromise;

  try {
    const conn = await connPromise;

    // Attach listeners once
    conn.on('error', (err) => {
      console.error(`❌ DB connection error [${dbName}]:`, err);
      delete connections[dbName]; // Force reconnect on next call
    });

    conn.on('disconnected', () => {
      console.warn(`⚠️ DB disconnected [${dbName}]`);
      delete connections[dbName];
    });

    console.log(`✅ Connected to DB: ${dbName}`);
    return conn;
  } catch (err) {
    delete connections[dbName]; // cleanup failed connection
    throw err;
  }
}

/**
 * Get current connection stats for debugging.
 */
export function getConnectionStats() {
  return Object.entries(connections).map(([dbName, connPromise]) => {
    const conn = (connPromise as any).client?.connection || null;
    return {
      dbName,
      readyState: conn?.readyState ?? 'unknown',
      host: conn?.host,
      port: conn?.port,
    };
  });
}

/**
 * Gracefully close all DB connections (on app shutdown).
 */
export async function closeAllConnections() {
  const promises = Object.entries(connections).map(async ([dbName, connPromise]) => {
    const conn = await connPromise;
    console.log(`Closing connection for ${dbName}`);
    return conn.close();
  });

  await Promise.all(promises);
  Object.keys(connections).forEach((key) => delete connections[key]);
}
