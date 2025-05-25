"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { ContestBanner } from "@/components/homepage/contest-banner"
import { PrizesSection } from "@/components/homepage/prizes-section"
import { DashboardPrizePool } from "@/components/homepage/dashboard-prize-pool"
import { useLocomotiveScroll } from "@/hooks/use-locomotive-scroll"
import { useAnimationObserver } from "@/hooks/use-animation-observer"
import { DashboardHeroSection } from "@/components/homepage/dashboard-hero-section"
import { LoadingAnimation } from "@/components/ui/loading"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { scrollRef } = useLocomotiveScroll()
  
  // Initialize animation observer
  useAnimationObserver()

  // Redirect unauthenticated users to landing page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Show loading while checking auth
  if (loading) {
    return <LoadingAnimation />
  }

  if (!user) {
    return null
  }

  return (
    <div ref={scrollRef} data-scroll-container>
      <main className="min-h-screen">
        <DashboardHeroSection />
        <ContestBanner />
        <DashboardPrizePool />
        <PrizesSection />
      </main>
    </div>
  )
} 