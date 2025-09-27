"use client"
import { LoginForm } from "@/components/auth/login-form"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function LoginPage() {
  return (
    <AuthGuard>
      <LoginForm />
    </AuthGuard>
  )
} 