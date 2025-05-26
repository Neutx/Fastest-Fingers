"use client"

import { Clock, Calendar, AlertCircle } from "lucide-react"
import { useTimer } from "@/hooks/use-timer"

export function ContestBanner() {
  const { timeLeft, contestStatus, contestSettings } = useTimer()

  const getBannerMessage = () => {
    // If no contest settings are configured, show default message
    if (!contestSettings) {
      return `Contest ends in: ${timeLeft}`
    }

    switch (contestStatus) {
      case 'not-started':
        return `Contest starts in: ${timeLeft}`
      case 'active':
        return `Contest ends in: ${timeLeft}`
      case 'ended':
        return 'Contest has ended'
      default:
        return `Contest ends in: ${timeLeft}`
    }
  }

  const getBannerIcon = () => {
    if (!contestSettings) {
      return <Clock className="w-6 h-6 text-black hover-pop" />
    }

    switch (contestStatus) {
      case 'not-started':
        return <Calendar className="w-6 h-6 text-black hover-pop" />
      case 'active':
        return <Clock className="w-6 h-6 text-black hover-pop" />
      case 'ended':
        return <AlertCircle className="w-6 h-6 text-black hover-pop" />
      default:
        return <Clock className="w-6 h-6 text-black hover-pop" />
    }
  }

  const getBannerColor = () => {
    if (!contestSettings) {
      return 'bg-white'
    }

    switch (contestStatus) {
      case 'not-started':
        return 'bg-blue-50'
      case 'active':
        return 'bg-white'
      case 'ended':
        return 'bg-red-50'
      default:
        return 'bg-white'
    }
  }

  // Always show the banner - either with real countdown or fallback
  return (
    <div 
      className={`${getBannerColor()} py-4 px-4`}
      data-scroll-section
    >
      <div 
        className="max-w-7xl mx-auto flex items-center justify-center gap-3 animate-fade-in-up opacity-0"
        data-scroll
        data-scroll-speed="0.1"
      >
        {getBannerIcon()}
        <span className="text-black font-semibold text-lg md:text-xl font-jost">
          {getBannerMessage()}
        </span>
      </div>
    </div>
  )
} 