import mongoose from 'mongoose';

// In-memory fallback data store if MONGODB_URI is not provided or fails to connect
// This guarantees the application stays 100% functional in development/preview.
export let isUsingMemoryDb = false;
export let dbConnectionError: string | null = null;

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri === 'your_mongodb_atlas_connection_string' || mongoUri.trim() === '') {
    console.log('ℹ️ MONGODB_URI is not configured. Running in-memory database mode for seamless preview.');
    isUsingMemoryDb = true;
    dbConnectionError = 'MONGODB_URI environment variable is not set.';
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.host}`);
    isUsingMemoryDb = false;
    dbConnectionError = null;
  } catch (error: any) {
    dbConnectionError = error.message || 'Failed to connect to MongoDB Atlas cluster.';
    console.warn('⚠️ MongoDB Atlas Connection Notice:', dbConnectionError);
    console.warn('💡 Tip: Ensure IP 0.0.0.0/0 is added to Network Access in MongoDB Atlas whitelist.');
    console.log('🔄 Falling back to in-memory database store so the app remains fully functional.');
    isUsingMemoryDb = true;
  }
};

export const getDbStatus = () => {
  return {
    isUsingMemoryDb,
    type: isUsingMemoryDb ? 'In-Memory Store' : 'MongoDB Atlas',
    connected: !isUsingMemoryDb,
    error: dbConnectionError,
  };
};

