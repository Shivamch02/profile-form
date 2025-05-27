"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User, Check, X } from "lucide-react"
import type { FormData, FormErrors } from "../profile-update-form"
import { checkUsernameAvailability } from "@/app/actions/validation"

interface PersonalInfoStepProps {
  formData: FormData
  errors: FormErrors
  updateFormData: (field: keyof FormData, value: any) => void
  setErrors: (errors: FormErrors | ((prev: FormErrors) => FormErrors)) => void
}

export function PersonalInfoStep({ formData, errors, updateFormData, setErrors }: PersonalInfoStepProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const usernameTimeoutRef = useRef<NodeJS.Timeout>()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, profilePhoto: "Only JPG and PNG files are allowed" }))
      return
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profilePhoto: "File size must be less than 2MB" }))
      return
    }

    updateFormData("profilePhoto", file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const checkUsername = async (username: string) => {
    if (username.length < 4) return

    setUsernameStatus("checking")
    try {
      const result = await checkUsernameAvailability(username)
      setUsernameStatus(result.available ? "available" : "taken")
      if (!result.available) {
        setErrors((prev) => ({ ...prev, username: "Username is already taken" }))
      }
    } catch (error) {
      setUsernameStatus("idle")
    }
  }

  const handleUsernameChange = (value: string) => {
    updateFormData("username", value)
    setUsernameStatus("idle")

    // Clear existing timeout
    if (usernameTimeoutRef.current) {
      clearTimeout(usernameTimeoutRef.current)
    }

    // Set new timeout for username check
    if (value.length >= 4) {
      usernameTimeoutRef.current = setTimeout(() => {
        checkUsername(value)
      }, 500)
    }
  }

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 12.5
    if (/[!@#$%^&*]/.test(password)) strength += 12.5
    return Math.min(strength, 100)
  }

  const handlePasswordChange = (value: string) => {
    updateFormData("newPassword", value)
    setPasswordStrength(calculatePasswordStrength(value))
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500"
    if (passwordStrength < 50) return "bg-orange-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak"
    if (passwordStrength < 50) return "Fair"
    if (passwordStrength < 75) return "Good"
    return "Strong"
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Personal Information</h3>

      {/* Profile Photo */}
      <div className="space-y-2">
        <Label htmlFor="profilePhoto">Profile Photo *</Label>
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={previewUrl || "/placeholder.svg"} />
            <AvatarFallback>
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </Button>
            <p className="text-xs text-muted-foreground mt-1">JPG or PNG, max 2MB</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          className="hidden"
        />
        {errors.profilePhoto && <p className="text-sm text-red-500">{errors.profilePhoto}</p>}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username *</Label>
        <div className="relative">
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            placeholder="Enter username (4-20 characters, no spaces)"
            className={errors.username ? "border-red-500" : ""}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {usernameStatus === "checking" && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
            {usernameStatus === "available" && <Check className="w-4 h-4 text-green-500" />}
            {usernameStatus === "taken" && <X className="w-4 h-4 text-red-500" />}
          </div>
        </div>
        {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
        {usernameStatus === "available" && <p className="text-sm text-green-500">Username is available!</p>}
      </div>

      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={(e) => updateFormData("currentPassword", e.target.value)}
          placeholder="Required only if changing password"
          className={errors.currentPassword ? "border-red-500" : ""}
        />
        {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={(e) => handlePasswordChange(e.target.value)}
          placeholder="8+ chars, 1 number, 1 special character"
          className={errors.newPassword ? "border-red-500" : ""}
        />
        {formData.newPassword && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Password Strength: {getPasswordStrengthText()}</span>
              <span>{Math.round(passwordStrength)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          </div>
        )}
        {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
      </div>
    </div>
  )
}
