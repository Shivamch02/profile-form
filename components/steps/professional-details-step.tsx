"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData, FormErrors } from "../profile-update-form"

interface ProfessionalDetailsStepProps {
  formData: FormData
  errors: FormErrors
  updateFormData: (field: keyof FormData, value: any) => void
}

export function ProfessionalDetailsStep({ formData, errors, updateFormData }: ProfessionalDetailsStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Professional Details</h3>

      {/* Profession */}
      <div className="space-y-2">
        <Label htmlFor="profession">Profession *</Label>
        <Select
          value={formData.profession}
          onValueChange={(value) => {
            updateFormData("profession", value)
            // Clear company name if not entrepreneur
            if (value !== "Entrepreneur") {
              updateFormData("companyName", "")
            }
          }}
        >
          <SelectTrigger className={errors.profession ? "border-red-500" : ""}>
            <SelectValue placeholder="Select your profession" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Student">Student</SelectItem>
            <SelectItem value="Developer">Developer</SelectItem>
            <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
          </SelectContent>
        </Select>
        {errors.profession && <p className="text-sm text-red-500">{errors.profession}</p>}
      </div>

      {/* Company Name - Show only if Entrepreneur */}
      {formData.profession === "Entrepreneur" && (
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => updateFormData("companyName", e.target.value)}
            placeholder="Enter your company name"
            className={errors.companyName ? "border-red-500" : ""}
          />
          {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
        </div>
      )}

      {/* Address Line 1 */}
      <div className="space-y-2">
        <Label htmlFor="addressLine1">Address Line 1 *</Label>
        <Input
          id="addressLine1"
          value={formData.addressLine1}
          onChange={(e) => updateFormData("addressLine1", e.target.value)}
          placeholder="Enter your address"
          className={errors.addressLine1 ? "border-red-500" : ""}
        />
        {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1}</p>}
      </div>
    </div>
  )
}
