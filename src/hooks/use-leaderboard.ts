"use client"

import { useState, useEffect } from "react"
import { collection, query, getDocs, } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { LeaderboardPlayer } from "@/types/leaderboard"

export function useLeaderboard(currentUserUid?: string) {
  const [topPlayers, setTopPlayers] = useState<LeaderboardPlayer[]>([])
  const [allPlayers, setAllPlayers] = useState<LeaderboardPlayer[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!currentUserUid) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // Query to get all users, we'll filter completed tests in code
        const usersRef = collection(db, 'users')
        const q = query(usersRef)
        
        const querySnapshot = await getDocs(q)
        
        const players: LeaderboardPlayer[] = []
        let currentUserRank: number | null = null
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data()
          const testResult = userData.testResult
          
          if (testResult && testResult.score !== undefined && testResult.score > 0) {
            const player: LeaderboardPlayer = {
              rank: 0, // Will be set after sorting
              name: userData.displayName || userData.email?.split('@')[0] || 'Anonymous',
              score: testResult.score,
              avatar: userData.photoURL,
              isUser: doc.id === currentUserUid,
              uid: doc.id
            }
            
            players.push(player)
          }
        })
        
        // Sort players by score in descending order
        players.sort((a, b) => b.score - a.score)
        
        // Assign ranks and find current user's rank
        players.forEach((player, index) => {
          player.rank = index + 1
          if (player.uid === currentUserUid) {
            currentUserRank = index + 1
          }
        })
        
        setAllPlayers(players)
        setTopPlayers(players.slice(0, 3)) // Top 3 for podium
        setUserRank(currentUserRank)
        
      } catch {
        // Error fetching leaderboard
        setAllPlayers([])
        setTopPlayers([])
        setUserRank(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [currentUserUid])

  const getUserSurroundings = (contextSize: number = 3): LeaderboardPlayer[] => {
    if (!userRank || allPlayers.length === 0) return []
    
    const userIndex = userRank - 1
    const start = Math.max(0, userIndex - contextSize)
    const end = Math.min(allPlayers.length, userIndex + contextSize + 1)
    
    return allPlayers.slice(start, end)
  }

  return {
    topPlayers,
    allPlayers,
    userRank,
    isLoading,
    getUserSurroundings,
    totalPlayers: allPlayers.length
  }
} 