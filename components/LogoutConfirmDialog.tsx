'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LogOut, AlertTriangle } from 'lucide-react'

interface LogoutConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName?: string
  userRole?: string
}

export function LogoutConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName,
  userRole 
}: LogoutConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const getRedirectMessage = (role?: string) => {
    switch (role) {
      case 'mentor':
        return 'Setelah keluar dari akun, Anda akan diarahkan ke halaman login Divisi Mentor dan harus login kembali untuk mengakses dashboard.'
      case 'acara':
        return 'Setelah keluar dari akun, Anda akan diarahkan ke halaman login Divisi Acara dan harus login kembali untuk mengakses dashboard.'
      default:
        return 'Setelah keluar dari akun, Anda akan diarahkan ke halaman login peserta dan harus login kembali untuk mengakses dashboard.'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-lg">Keluar dari Akun</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {userName 
              ? `Apakah Anda yakin ingin keluar dari akun ${userName}?`
              : 'Apakah Anda yakin ingin keluar dari akun Anda?'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {getRedirectMessage(userRole)}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="min-w-[80px]"
          >
            Tidak
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            className="min-w-[80px] flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Ya, Keluar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
