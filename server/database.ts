import mongoose from 'mongoose';

let isConnected = false;

export async function connectToMongoDB(): Promise<void> {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URL;
    
    if (!mongoUrl) {
      throw new Error('MongoDB connection string not found. Please set MONGODB_URI or MONGO_URL environment variable.');
    }

    await mongoose.connect(mongoUrl, {
      bufferCommands: false,
    });

    isConnected = true;
    console.log('Successfully connected to MongoDB');

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      isConnected = false;
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}

export async function disconnectFromMongoDB(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

export function isMongoConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}