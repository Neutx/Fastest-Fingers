"use client"

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "@/components/ui/loading";
import { Header } from "@/components/ui/header";
import { LeaderboardSection } from "@/components/ui/leaderboard-section";
import { useAnimationObserver } from "@/hooks/use-animation-observer";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { usePrizePool } from "@/hooks/use-prize-pool";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserScore {
  wpm: number;
  accuracy: number;
  score: number;
}

export default function LeaderboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Fetch real leaderboard data
  const { allPlayers, isLoading: leaderboardLoading } = useLeaderboard(user?.uid);

  // Fetch dynamic prize pool data
  const { totalPrizePool, formattedBreakdown, isLoading: prizePoolLoading } = usePrizePool(user?.uid);

  // Initialize animation observer
  useAnimationObserver();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Fetch user's score data
  useEffect(() => {
    const fetchUserScore = async () => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.testResult) {
              setUserScore({
                wpm: userData.testResult.wpm || 0,
                accuracy: userData.testResult.accuracy || 0,
                score: userData.testResult.score || 0
              });
            }
          }
        } catch (error) {
          console.error('Error fetching user score:', error);
        }
      }
    };

    fetchUserScore();
  }, [user]);

  // Trigger animations after page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Get real leaderboard data for display
  const getDisplayData = () => {
    if (leaderboardLoading) {
      // Return loading data while fetching
      return [
        { rank: 1, name: "Loading...", score: 0 },
        { rank: 2, name: "Loading...", score: 0 },
        { rank: 3, name: "Loading...", score: 0 },
      ];
    }

    if (allPlayers.length === 0) {
      // Return placeholder data if no one has completed tests yet
      return [
        { rank: 1, name: "Be the first!", score: 0 },
        { rank: 2, name: "Complete the test", score: 0 },
        { rank: 3, name: "Join the leaderboard", score: 0 },
      ];
    }

    // Return real data - all players for the full leaderboard
    return allPlayers;
  };

  const leaderboardPlayers = getDisplayData();

  // Show loading while checking auth
  if (loading) {
    return <LoadingAnimation />;
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <main className="h-screen w-screen bg-black relative flex flex-col overflow-hidden scrollbar-hide">
      {/* Header */}
      <Header 
        currentPage="leaderboard" 
        isPageLoaded={isPageLoaded}
      />

      {/* Prize Pool - Desktop: Absolutely positioned on left, Mobile: Hidden */}
      <div className={`hidden lg:block absolute left-4 sm:left-8 md:left-12 lg:left-24 top-[20%] sm:top-1/4 transform z-10 transition-all duration-1000 ${isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '200ms' }}>
        <div className="relative">
          <div className="border border-white/30 rounded-lg bg-black/20 backdrop-blur-sm hover-pop">
            {/* Red Label */}
            <div className="absolute -top-3 right-2 sm:right-4">
              <div className="bg-red-600 text-white px-2 sm:px-4 py-1 rounded text-xs font-bold uppercase tracking-wide">
                CURR PRIZE POOL
              </div>
            </div>

            {/* Content */}
            <div className="pt-4 sm:pt-6 pb-3 sm:pb-4 px-3 sm:px-6">
              <div className="text-white font-bold text-[28px] sm:text-[42px] leading-none mb-1">
                ₹{prizePoolLoading ? "10,000" : totalPrizePool.toLocaleString()}
              </div>
              <div className="text-white/50 text-xs sm:text-sm">
                {prizePoolLoading ? "5000 + 20 × 250" : formattedBreakdown}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Centered Leaderboard */}
      <div className="flex-1 flex flex-col items-center justify-start px-2 sm:px-4 md:px-8 lg:px-16 py-4 sm:py-6 lg:py-8 relative overflow-hidden min-h-0 pt-8 sm:pt-12 md:pt-16">
        {/* Centered Leaderboard */}
        <div className={`max-w-4xl w-full transition-all duration-1000 transform flex flex-col min-h-0 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
          <div className="h-full flex flex-col overflow-hidden">
            <LeaderboardSection 
              players={leaderboardPlayers}
              userScore={userScore?.score}
            />
          </div>
        </div>

        {/* Prize Pool - Mobile/Tablet: Below Leaderboard, Desktop: Hidden */}
        <div className={`lg:hidden mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 ${isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '600ms' }}>
          <div className="relative">
            <div className="border border-white/30 rounded-xl sm:rounded-2xl bg-black/20 backdrop-blur-sm hover-pop">
              {/* Red Label */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-red-600 text-white px-3 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-bold uppercase tracking-wide whitespace-nowrap">
                  CURR PRIZE POOL
                </div>
              </div>

              {/* Content */}
              <div className="pt-8 sm:pt-10 md:pt-12 pb-4 sm:pb-6 md:pb-8 px-4 sm:px-8 md:px-10">
                <div className="text-white font-bold text-[36px] sm:text-[48px] md:text-[56px] leading-none mb-2 text-center">
                  ₹{prizePoolLoading ? "10,000" : totalPrizePool.toLocaleString()}
                </div>
                <div className="text-white/50 text-sm sm:text-base md:text-lg text-center">
                  {prizePoolLoading ? "5000 + 20 × 250" : formattedBreakdown}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 