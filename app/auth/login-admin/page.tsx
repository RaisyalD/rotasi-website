"use client"
import { AdminLoginForm } from "@/components/auth/admin-login-form"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function AdminLoginPage() {
  return (
    <AuthGuard>
      <AdminLoginForm />
    </AuthGuard>
  )
}
