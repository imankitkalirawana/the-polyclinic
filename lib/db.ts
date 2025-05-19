// utils/db.js
import mongoose from 'mongoose';

const databaseUrl = process.env.MONGO_URI || '';

const connectDB = async () => {
  try {
    await mongoose.connect(databaseUrl);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export { connectDB };
