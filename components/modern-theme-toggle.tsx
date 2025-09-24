'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export function ModernThemeToggle({ 
  className, 
  isHomePage = false, 
  isScrolled = false 
}: { 
  className?: string
  isHomePage?: boolean
  isScrolled?: boolean
}) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  // Determine icon colors based on context
  const getIconColor = (isActive: boolean) => {
    if (isHomePage && !isScrolled) {
      // On homepage when not scrolled, use white/black contrast
      return isActive ? "text-white" : "text-white/60"
    } else {
      // Default behavior for other pages or when scrolled
      return isActive ? "text-foreground" : "text-muted-foreground"
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Sun className={cn(
        "h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:scale-110 active:scale-95",
        getIconColor(!isDark)
      )} />
      <Switch
        checked={isDark}
        onCheckedChange={handleToggle}
        className={cn(
          "data-[state=checked]:bg-primary",
          "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hover:scale-105 active:scale-95",
          "data-[state=checked]:shadow-lg data-[state=checked]:shadow-primary/25"
        )}
      />
      <Moon className={cn(
        "h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:scale-110 active:scale-95",
        getIconColor(isDark)
      )} />
    </div>
  )
}
