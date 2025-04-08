"use server"
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

// Reduce multiple connections to the database
const connection: ConnectionObject = {};

export const dbConnection = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  try {
    const URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
    
    const db = await mongoose.connect(URI);
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to the database");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Database connection failed");
  }
};
