"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoadingAnimation } from "@/components/ui/loading"
import { HeroSection } from "@/components/homepage/hero-section"
import { ContestBanner } from "@/components/homepage/contest-banner"
import { RulesSection } from "@/components/homepage/rules-section"
import { PrizesSection } from "@/components/homepage/prizes-section"
import { useLocomotiveScroll } from "@/hooks/use-locomotive-scroll"
import { useAnimationObserver } from "@/hooks/use-animation-observer"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { scrollRef } = useLocomotiveScroll()
  
  // Initialize animation observer
  useAnimationObserver()

  // Redirect authenticated users to contest page
  useEffect(() => {
    if (!loading && user) {
      router.push('/contest')
    }
  }, [user, loading, router])

  // Show loading while checking auth
  if (loading) {
    return <LoadingAnimation />
  }

  // Don't render if authenticated (will redirect)
  if (user) {
    return null
  }

  return (
    <div ref={scrollRef} data-scroll-container>
      <main className="min-h-screen">
        <HeroSection />
        <ContestBanner />
        <RulesSection />
        <PrizesSection />
      </main>
    </div>
  )
}
