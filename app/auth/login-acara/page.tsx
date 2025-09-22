"use client"
import { AcaraLoginForm } from "@/components/auth/acara-login-form"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function AcaraLoginPage() {
  return (
    <AuthGuard>
      <AcaraLoginForm />
    </AuthGuard>
  )
}
