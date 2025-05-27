"use server";

import { connectToDatabase } from "@/lib/mongodb";

export async function checkUsernameAvailability(username: string) {
  try {
    const { db } = await connectToDatabase();

    const existingUser = await db.collection("users").findOne({ username });

    return { available: !existingUser };
  } catch (error) {
    console.error("Username check error:", error);
    return { available: false };
  }
}
