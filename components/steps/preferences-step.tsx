"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { FormData, FormErrors } from "../profile-update-form"
import { getCountries, getStates, getCities } from "@/app/actions/location"

interface LocationData {
  countries: Array<{ id: string; name: string }>
  states: Array<{ id: string; name: string }>
  cities: Array<{ id: string; name: string }>
}

interface PreferencesStepProps {
  formData: FormData
  errors: FormErrors
  updateFormData: (field: keyof FormData, value: any) => void
}

export function PreferencesStep({ formData, errors, updateFormData }: PreferencesStepProps) {
  const [locationData, setLocationData] = useState<LocationData>({
    countries: [],
    states: [],
    cities: [],
  })
  const [loading, setLoading] = useState({
    countries: false,
    states: false,
    cities: false,
  })

  // Load countries on component mount
  useEffect(() => {
    loadCountries()
  }, [])

  // Load states when country changes
  useEffect(() => {
    if (formData.country) {
      loadStates(formData.country)
      // Reset state and city when country changes
      updateFormData("state", "")
      updateFormData("city", "")
    }
  }, [formData.country])

  // Load cities when state changes
  useEffect(() => {
    if (formData.state) {
      loadCities(formData.state)
      // Reset city when state changes
      updateFormData("city", "")
    }
  }, [formData.state])

  const loadCountries = async () => {
    setLoading((prev) => ({ ...prev, countries: true }))
    try {
      const countries = await getCountries()
      setLocationData((prev) => ({ ...prev, countries }))
    } catch (error) {
      console.error("Failed to load countries:", error)
    } finally {
      setLoading((prev) => ({ ...prev, countries: false }))
    }
  }

  const loadStates = async (countryId: string) => {
    setLoading((prev) => ({ ...prev, states: true }))
    try {
      const states = await getStates(countryId)
      setLocationData((prev) => ({ ...prev, states, cities: [] }))
    } catch (error) {
      console.error("Failed to load states:", error)
    } finally {
      setLoading((prev) => ({ ...prev, states: false }))
    }
  }

  const loadCities = async (stateId: string) => {
    setLoading((prev) => ({ ...prev, cities: true }))
    try {
      const cities = await getCities(stateId)
      setLocationData((prev) => ({ ...prev, cities }))
    } catch (error) {
      console.error("Failed to load cities:", error)
    } finally {
      setLoading((prev) => ({ ...prev, cities: false }))
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Preferences</h3>

      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country">Country *</Label>
        <Select
          value={formData.country}
          onValueChange={(value) => updateFormData("country", value)}
          disabled={loading.countries}
        >
          <SelectTrigger className={errors.country ? "border-red-500" : ""}>
            <SelectValue placeholder={loading.countries ? "Loading countries..." : "Select country"} />
          </SelectTrigger>
          <SelectContent>
            {locationData.countries.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
      </div>

      {/* State */}
      <div className="space-y-2">
        <Label htmlFor="state">State *</Label>
        <Select
          value={formData.state}
          onValueChange={(value) => updateFormData("state", value)}
          disabled={!formData.country || loading.states}
        >
          <SelectTrigger className={errors.state ? "border-red-500" : ""}>
            <SelectValue
              placeholder={
                !formData.country ? "Select country first" : loading.states ? "Loading states..." : "Select state"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {locationData.states.map((state) => (
              <SelectItem key={state.id} value={state.id}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">City *</Label>
        <Select
          value={formData.city}
          onValueChange={(value) => updateFormData("city", value)}
          disabled={!formData.state || loading.cities}
        >
          <SelectTrigger className={errors.city ? "border-red-500" : ""}>
            <SelectValue
              placeholder={
                !formData.state ? "Select state first" : loading.cities ? "Loading cities..." : "Select city"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {locationData.cities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
      </div>

      {/* Subscription Plan */}
      <div className="space-y-3">
        <Label>Subscription Plan *</Label>
        <RadioGroup
          value={formData.subscriptionPlan}
          onValueChange={(value) => updateFormData("subscriptionPlan", value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Basic" id="basic" />
            <Label htmlFor="basic">Basic - Free</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Pro" id="pro" />
            <Label htmlFor="pro">Pro - $9.99/month</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Enterprise" id="enterprise" />
            <Label htmlFor="enterprise">Enterprise - $29.99/month</Label>
          </div>
        </RadioGroup>
        {errors.subscriptionPlan && <p className="text-sm text-red-500">{errors.subscriptionPlan}</p>}
      </div>

      {/* Newsletter */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="newsletter"
          checked={formData.newsletter}
          onCheckedChange={(checked) => updateFormData("newsletter", checked)}
        />
        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
      </div>
    </div>
  )
}
