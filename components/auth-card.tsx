import React from "react"

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl px-8 py-10 max-w-md w-full mx-auto flex flex-col items-center">
      {children}
    </div>
  )
} 