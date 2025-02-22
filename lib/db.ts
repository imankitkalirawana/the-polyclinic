// utils/db.js
import mongoose from 'mongoose';

const databaseUrl = process.env.NEXT_PUBLIC_MONGO_URL || '';

const connectDB = async () => {
  try {
    await mongoose.connect(databaseUrl);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export { connectDB };
