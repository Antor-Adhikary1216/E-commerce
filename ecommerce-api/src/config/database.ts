import mongoose from "mongoose";
import { env } from "./env.js";

let cached: Promise<typeof mongoose> | null = null;

export async function connectDatabase(): Promise<typeof mongoose> {
  if (cached) return cached;
  mongoose.set("strictQuery", true);
  cached = mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10_000,
    bufferCommands: false,
  });
  try {
    await cached;
  } catch (err) {
    cached = null; // allow retry on next invocation
    throw err;
  }
  return cached;
}
