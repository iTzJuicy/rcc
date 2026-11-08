import mongoose from "mongoose";

// Disable command buffering so queries don't hang for 10s if the DB isn't ready
mongoose.set("bufferCommands", false);

export async function connectDB() {
  const uris = [
    process.env.MONGO_URI,
    "mongodb://127.0.0.1:27017/rcc_infrastructure",
    "mongodb://127.0.0.1:27018/rcc_infrastructure",
  ].filter(Boolean);

  // Remove duplicates while preserving order
  const uniqueUris = [...new Set(uris)];

  for (const uri of uniqueUris) {
    try {
      console.log(`[Database] Attempting connection to MongoDB at ${uri}...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`[Database] MongoDB Connected successfully to: ${conn.connection.host}:${conn.connection.port}`);
      return conn;
    } catch (error) {
      console.warn(`[Database] Connection to ${uri} failed: ${error.message}`);
    }
  }

  console.error(`[Database Error] Could not connect to any MongoDB instance.`);
  return null;
}

export default connectDB;
