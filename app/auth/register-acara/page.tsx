"use client"
import { AcaraRegisterForm } from "@/components/auth/acara-register-form"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function AcaraRegisterPage() {
  return (
    <AuthGuard>
      <AcaraRegisterForm />
    </AuthGuard>
  )
}
