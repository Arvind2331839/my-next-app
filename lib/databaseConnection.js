import mongoose from 'mongoose'

const MONGO_URL = process.env.MONGO_URI
if (!MONGO_URL) {
  throw new Error('Please set MONGO_URI in your environment')
}

let cached = globalThis.mongoose
if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, {
      dbName: 'my-next-app',
      bufferCommands: false,
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    // reset so a later call can retry
    cached.promise = null
    cached.conn = null
    throw err
  }

  return cached.conn
}
