"use client"

import { LoadingAnimation } from "@/components/ui/loading";
import { Header } from "@/components/ui/header";
import { LeaderboardSection } from "@/components/ui/leaderboard-section";
import { useLeaderboard } from "@/hooks/use-leaderboard";

export default function LeaderboardPage() {
  const { user, loading, userScore, isPageLoaded, leaderboardPlayers } = useLeaderboard();

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
                ₹10,000
              </div>
              <div className="text-white/50 text-xs sm:text-sm">
                5000 + 20 × 250
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
                  ₹10,000
                </div>
                <div className="text-white/50 text-sm sm:text-base md:text-lg text-center">
                  5000 + 20 × 250
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 