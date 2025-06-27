"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface PrizePoolData {
  totalUsers: number;
  basePrize: number;
  perUserBonus: number;
  totalPrizePool: number;
  formattedBreakdown: string;
}

export function usePrizePool(currentUserUid?: string) {
  const [prizeData, setPrizeData] = useState<PrizePoolData>({
    totalUsers: 0,
    basePrize: 5000,
    perUserBonus: 5,
    totalPrizePool: 5000,
    formattedBreakdown: "5000 + 0 × 5"
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserCount = async () => {
      if (!currentUserUid) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // Get all users from the users collection
        const usersRef = collection(db, 'users')
        const querySnapshot = await getDocs(usersRef)
        
        const totalUsers = querySnapshot.size
        const basePrize = 5000
        const perUserBonus = 5
        const totalPrizePool = basePrize + (totalUsers * perUserBonus)
        const formattedBreakdown = `${basePrize} + ${totalUsers} × ${perUserBonus}`
        
        setPrizeData({
          totalUsers,
          basePrize,
          perUserBonus,
          totalPrizePool,
          formattedBreakdown
        })
        
      } catch {
        // Error fetching user count for prize pool
        // Keep default values on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserCount()
    
    // Optional: Set up real-time listener for live updates
    // You can uncomment this if you want real-time updates
    // const interval = setInterval(fetchUserCount, 30000) // Update every 30 seconds
    // return () => clearInterval(interval)
    
  }, [currentUserUid])

  return {
    ...prizeData,
    isLoading
  }
} 