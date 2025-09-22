"use client"
import { RegisterForm } from "@/components/auth/register-form"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function RegisterPage() {
  return (
    <AuthGuard>
      <RegisterForm />
    </AuthGuard>
  )
} 