import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 })
    }

    // Validate file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return NextResponse.json({ error: "Only JPG and PNG files are allowed" }, { status: 400 })
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 2MB" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public/uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const path = join(uploadsDir, filename)

    await writeFile(path, buffer)

    return NextResponse.json({
      success: true,
      filename,
      url: `/uploads/${filename}`,
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "File upload failed" }, { status: 500 })
  }
}
