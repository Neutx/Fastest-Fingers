"use client"

import { Clock } from "lucide-react"
import { useTimer } from "@/hooks/use-timer"

export function ContestBanner() {
  const { timeLeft } = useTimer()

  return (
    <div 
      className="bg-white py-4 px-4"
      data-scroll-section
    >
      <div 
        className="max-w-7xl mx-auto flex items-center justify-center gap-3 animate-fade-in-up opacity-0"
        data-scroll
        data-scroll-speed="0.1"
      >
        <Clock className="w-6 h-6 text-black hover-pop" />
        <span className="text-black font-semibold text-lg md:text-xl font-jost">
          Contest ends in: {timeLeft}
        </span>
      </div>
    </div>
  )
} 