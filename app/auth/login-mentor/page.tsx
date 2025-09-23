"use client"
import { MentorLoginForm } from "@/components/auth/mentor-login-form"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function MentorLoginPage() {
  return (
    <AuthGuard>
      <MentorLoginForm />
    </AuthGuard>
  )
}
