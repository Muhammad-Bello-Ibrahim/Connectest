import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/connectest"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cached = (global as any).mongoose || { conn: null, promise: null }

async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB
// This code connects to a MongoDB database using Mongoose.
// It checks if a connection already exists, and if not, it creates a new connection.