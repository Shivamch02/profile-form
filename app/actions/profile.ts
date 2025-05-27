"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import bcrypt from "bcryptjs"

export async function submitProfile(formData: FormData) {
  try {
    const { db } = await connectToDatabase()

    // Extract and validate form data
    const profileData = {
      username: formData.get("username") as string,
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      profession: formData.get("profession") as string,
      companyName: formData.get("companyName") as string,
      addressLine1: formData.get("addressLine1") as string,
      country: formData.get("country") as string,
      state: formData.get("state") as string,
      city: formData.get("city") as string,
      subscriptionPlan: formData.get("subscriptionPlan") as string,
      newsletter: formData.get("newsletter") === "true",
    }

    // Validate required fields
    if (!profileData.username || !profileData.profession || !profileData.addressLine1) {
      return { success: false, error: "Missing required fields" }
    }

    // Check if username already exists
    const existingUser = await db.collection("users").findOne({ username: profileData.username })
    if (existingUser) {
      return { success: false, error: "Username already exists" }
    }

    // Handle file upload
    const profilePhoto = formData.get("profilePhoto") as File
    let photoPath = ""

    if (profilePhoto && profilePhoto.size > 0) {
      // Validate file
      if (!["image/jpeg", "image/png"].includes(profilePhoto.type)) {
        return { success: false, error: "Invalid file type. Only JPG and PNG are allowed." }
      }

      if (profilePhoto.size > 2 * 1024 * 1024) {
        return { success: false, error: "File size too large. Maximum 2MB allowed." }
      }

      const bytes = await profilePhoto.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Ensure uploads directory exists
      const uploadsDir = join(process.cwd(), "public/uploads")
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      // Create unique filename
      const filename = `${Date.now()}-${profilePhoto.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      const path = join(uploadsDir, filename)

      await writeFile(path, buffer)
      photoPath = `/uploads/${filename}`
    }

    // Hash password if provided
    let hashedPassword = ""
    if (profileData.newPassword) {
      // Validate password strength
      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
      if (!passwordRegex.test(profileData.newPassword)) {
        return { success: false, error: "Password does not meet requirements" }
      }
      hashedPassword = await bcrypt.hash(profileData.newPassword, 12)
    }

    // Prepare document for MongoDB
    const userDocument = {
      ...profileData,
      profilePhoto: photoPath,
      password: hashedPassword || undefined,
      updatedAt: new Date(),
      createdAt: new Date(),
    }

    // Remove undefined fields
    Object.keys(userDocument).forEach((key) => {
      if (userDocument[key as keyof typeof userDocument] === undefined) {
        delete userDocument[key as keyof typeof userDocument]
      }
    })

    // Insert into MongoDB
    const result = await db.collection("users").insertOne(userDocument)

    if (result.insertedId) {
      return {
        success: true,
        id: result.insertedId.toString(),
        message: "Profile created successfully!",
      }
    } else {
      return { success: false, error: "Failed to save profile" }
    }
  } catch (error) {
    console.error("Profile submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
