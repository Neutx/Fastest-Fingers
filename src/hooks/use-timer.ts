"use client"

import { useState, useEffect } from "react"

interface UseTimerProps {
  initialTime?: string
}

export function useTimer({ initialTime = "99:59:59" }: UseTimerProps = {}) {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  useEffect(() => {
    // TODO: Connect to Firebase for real-time contest end time
    // For now, we'll use a static countdown
    const timer = setInterval(() => {
      // This is a placeholder - will be replaced with Firebase integration
      setTimeLeft(initialTime)
    }, 1000)

    return () => clearInterval(timer)
  }, [initialTime])

  return { timeLeft }
} 