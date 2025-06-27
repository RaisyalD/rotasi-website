"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ targetDate = "2025-09-01T00:00:00" }: { targetDate?: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex justify-center gap-4 flex-wrap">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <Card key={unit} className="bg-background border-primary/20 w-24 sm:w-32">
          <CardContent className="p-4 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary">{value}</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1 capitalize">{unit}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
