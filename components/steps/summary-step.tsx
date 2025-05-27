"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Briefcase, CreditCard, Mail } from "lucide-react"
import type { FormData } from "../profile-update-form"

interface SummaryStepProps {
  formData: FormData
}

export function SummaryStep({ formData }: SummaryStepProps) {
  const getPreviewUrl = () => {
    if (formData.profilePhoto) {
      return URL.createObjectURL(formData.profilePhoto)
    }
    return ""
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Review Your Information</h3>
        <p className="text-sm text-muted-foreground mt-1">Please review all information before submitting</p>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={getPreviewUrl() || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-lg">{formData.username}</p>
                {formData.profilePhoto && (
                  <p className="text-xs text-muted-foreground">
                    {formData.profilePhoto.name} ({formatFileSize(formData.profilePhoto.size)})
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.newPassword ? "✓ Password will be updated" : "Password unchanged"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Professional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Profession:</span>
              <Badge variant="secondary">{formData.profession}</Badge>
            </div>
            {formData.companyName && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium">{formData.companyName}</span>
              </div>
            )}
            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">Address:</span>
              <span className="text-right font-medium max-w-[200px]">{formData.addressLine1}</span>
            </div>
          </CardContent>
        </Card>

        {/* Location & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Location:</span>
              <span className="text-right font-medium">
                {formData.city}, {formData.state}, {formData.country}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                Subscription:
              </span>
              <Badge variant={formData.subscriptionPlan === "Basic" ? "secondary" : "default"}>
                {formData.subscriptionPlan}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Newsletter:
              </span>
              <Badge variant={formData.newsletter ? "default" : "secondary"}>
                {formData.newsletter ? "Subscribed" : "Not subscribed"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Once submitted, your profile information will be saved to the database. Make sure all
          information is correct before proceeding.
        </p>
      </div>
    </div>
  )
}
