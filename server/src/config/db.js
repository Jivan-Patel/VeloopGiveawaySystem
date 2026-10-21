import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas or local MongoDB replica set.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[DB] Warning: MONGODB_URI not defined in environment variables. Database operations disabled.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('[DB] MongoDB connection error:', err.message);
    return null;
  }
}

/**
 * Verifies whether the connected MongoDB instance supports multi-document transactions (Replica Set enabled).
 */
export async function checkTransactionSupport() {
  if (mongoose.connection.readyState !== 1) {
    return { supported: false, reason: 'Database not connected' };
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await session.abortTransaction();
    await session.endSession();
    return { supported: true, reason: 'Replica set active and transaction executed successfully' };
  } catch (err) {
    return { supported: false, reason: err.message };
  }
}
