"use server";

import { connectToDatabase } from "@/lib/mongodb";

export async function checkUsernameAvailability(username: string) {
  try {
    console.log("Checking username availability:", username);
    const { db } = await connectToDatabase();
    console.log("Connected to database:", db.databaseName);

    const existingUser = await db.collection("users").findOne({ username });
    console.log("Existing user:", existingUser);

    return { available: !existingUser };
  } catch (error) {
    console.error("Username check error:", error);
    return { available: false };
  }
}
