"use client"
import { AdminRegisterForm } from "@/components/auth/admin-register-form"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function AdminRegisterPage() {
  return (
    <AuthGuard>
      <AdminRegisterForm />
    </AuthGuard>
  )
}
