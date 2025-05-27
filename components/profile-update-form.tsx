"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PersonalInfoStep } from "./steps/personal-info-step"
import { ProfessionalDetailsStep } from "./steps/professional-details-step"
import { PreferencesStep } from "./steps/preferences-step"
import { SummaryStep } from "./steps/summary-step"
import { submitProfile } from "@/app/actions/profile"
import { useToast } from "@/hooks/use-toast"

export interface FormData {
  profilePhoto: File | null
  username: string
  currentPassword: string
  newPassword: string
  profession: string
  companyName: string
  addressLine1: string
  country: string
  state: string
  city: string
  subscriptionPlan: string
  newsletter: boolean
}

export interface FormErrors {
  [key: string]: string
}

export function ProfileUpdateForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    profilePhoto: null,
    username: "",
    currentPassword: "",
    newPassword: "",
    profession: "",
    companyName: "",
    addressLine1: "",
    country: "",
    state: "",
    city: "",
    subscriptionPlan: "Basic",
    newsletter: true,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    switch (step) {
      case 1:
        if (!formData.profilePhoto) newErrors.profilePhoto = "Profile photo is required"
        if (!formData.username) newErrors.username = "Username is required"
        if (formData.username.length < 4 || formData.username.length > 20) {
          newErrors.username = "Username must be 4-20 characters"
        }
        if (formData.username.includes(" ")) {
          newErrors.username = "Username cannot contain spaces"
        }
        if (formData.newPassword && !formData.currentPassword) {
          newErrors.currentPassword = "Current password required to change password"
        }
        if (formData.newPassword) {
          const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
          if (!passwordRegex.test(formData.newPassword)) {
            newErrors.newPassword = "Password must be 8+ chars with 1 number and 1 special character"
          }
        }
        break
      case 2:
        if (!formData.profession) newErrors.profession = "Profession is required"
        if (formData.profession === "Entrepreneur" && !formData.companyName) {
          newErrors.companyName = "Company name is required for entrepreneurs"
        }
        if (!formData.addressLine1) newErrors.addressLine1 = "Address is required"
        break
      case 3:
        if (!formData.country) newErrors.country = "Country is required"
        if (!formData.state) newErrors.state = "State is required"
        if (!formData.city) newErrors.city = "City is required"
        if (!formData.subscriptionPlan) newErrors.subscriptionPlan = "Subscription plan is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsSubmitting(true)
    try {
      const formDataToSubmit = new FormData()

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "profilePhoto" && value) {
          formDataToSubmit.append(key, value)
        } else if (key !== "profilePhoto") {
          formDataToSubmit.append(key, String(value))
        }
      })

      const result = await submitProfile(formDataToSubmit)

      if (result.success) {
        toast({
          title: "Success!",
          description: "Profile updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep formData={formData} errors={errors} updateFormData={updateFormData} setErrors={setErrors} />
        )
      case 2:
        return <ProfessionalDetailsStep formData={formData} errors={errors} updateFormData={updateFormData} />
      case 3:
        return <PreferencesStep formData={formData} errors={errors} updateFormData={updateFormData} />
      case 4:
        return <SummaryStep formData={formData} />
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </CardTitle>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStep()}

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Profile"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
