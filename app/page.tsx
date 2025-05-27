import { ProfileUpdateForm } from "@/components/profile-update-form"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Update Your Profile</h1>
            <p className="text-gray-600">Complete your profile information in a few simple steps</p>
          </div>
          <ProfileUpdateForm />
        </div>
      </div>
      <Toaster />
    </div>
  )
}
