import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn(
    "⚠️ MONGODB_URI is not defined - DB features will be unavailable"
  );
}

let cached = (global as any).mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) return null;

  // Return existing connection immediately
  if (cached.conn) return cached.conn;

  // Create new connection promise if not already pending
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 30000,
      })
      .then((m) => {
        // Cache the connection on success
        cached.conn = m;
        return m;
      })
      .catch((err) => {
        // Reset promise so next request will retry — but don't retry infinitely
        cached.promise = null;
        cached.conn = null;
        console.error("❌ MongoDB connection failed:", err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Promise already rejected and reset above — just return null here
    return null;
  }

  return cached.conn;
}

export default connectDB;
