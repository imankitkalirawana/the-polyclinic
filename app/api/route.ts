import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const client = new MongoClient(process.env.MONGODB_URI!);

async function showActiveConnections() {
  await client.connect();
  const adminDb = client.db().admin();

  const serverStatus = await adminDb.serverStatus();
  await client.close();
  return serverStatus.connections;
}

export async function GET() {
  const connections = await showActiveConnections();
  return NextResponse.json({ message: 'Active connections', connections });
}
