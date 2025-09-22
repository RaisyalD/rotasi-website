"use client"
import { MentorRegisterForm } from "@/components/auth/mentor-register-form"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function MentorRegisterPage() {
  return (
    <AuthGuard>
      <MentorRegisterForm />
    </AuthGuard>
  )
}
