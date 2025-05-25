"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoadingAnimation } from "@/components/ui/loading"

export default function LeaderboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-faster-one text-[#A578FD] mb-4">
          LEADERBOARD
        </h1>
        <p className="text-xl">Coming Soon...</p>
      </div>
    </main>
  )
} 