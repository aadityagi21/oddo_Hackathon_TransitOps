import mongoose from 'mongoose';

/**
 * MongoDB connection handler.
 * Used as a standalone utility; primary connection is in server.js.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;
