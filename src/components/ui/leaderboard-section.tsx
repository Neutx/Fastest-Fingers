import { LeaderboardPodium } from "./leaderboard-podium";
import { LeaderboardPlayer } from "@/types/leaderboard";
import { useEffect, useRef, useState } from "react";

interface LeaderboardSectionProps {
  players: LeaderboardPlayer[];
  userScore?: number;
}

export function LeaderboardSection({ players }: LeaderboardSectionProps) {
  // Get top 3 for podium
  const topThree = players.slice(0, 3);
  
  // Show all players in the table (including top 3)
  // Filter out placeholder players (score = 0) from the table
  const listPlayers = players.filter(player => player.score > 0);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find user's position in the leaderboard
  const userPlayerIndex = listPlayers.findIndex(player => player.isUser);

  // Auto-scroll to user's position when data loads or changes
  useEffect(() => {
    if (scrollContainerRef.current && userPlayerIndex !== -1 && !isUserScrolling) {
      const container = scrollContainerRef.current;
      const userElement = container.children[userPlayerIndex] as HTMLElement;
      
      if (userElement) {
        // Calculate if user is in the visible area (first 7 items)
        const isInVisibleArea = userPlayerIndex < 7;
        
        if (!isInVisibleArea) {
          // Scroll to show user's position with some context
          const scrollPosition = Math.max(0, userPlayerIndex - 3) * (userElement.offsetHeight + 4); // 4px for gap
          container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
      }
    }
  }, [listPlayers, userPlayerIndex, isUserScrolling]);

  // Handle scroll events
  const handleScroll = () => {
    setIsUserScrolling(true);
    
    // Clear existing timeout
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
    
    // Reset scrolling flag after user stops scrolling for 3 seconds
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 3000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Podium Section - Centered and Smaller for small screens */}
      <div className="flex-1 flex items-center justify-center relative z-20 px-0.5 sm:px-1 lg:px-2 max-h-[40%] sm:max-h-[42%] lg:max-h-[45%]">
        <LeaderboardPodium topPlayers={topThree} />
      </div>

      {/* Leaderboard List - Fixed height for 7 players */}
      <div className="flex-1 bg-[#1E2237] backdrop-blur-sm rounded-md sm:rounded-lg lg:rounded-xl md:rounded-2xl p-1 sm:p-1.5 md:p-3 lg:p-4 overflow-hidden flex flex-col min-h-0 -mt-[10px] sm:-mt-[15px] md:-mt-[22px] lg:-mt-[28px] pt-[15px] sm:pt-[20px] md:pt-[28px] lg:pt-[34px] relative z-10">
        <div 
          ref={scrollContainerRef}
          className="overflow-y-auto space-y-0.5 sm:space-y-0.5 md:space-y-1.5 scrollbar-hide"
          style={{ 
            maxHeight: 'calc(7 * (2.5rem + 0.125rem))', // Approximate height for 7 items including gaps
            minHeight: 'calc(7 * (2.5rem + 0.125rem))'
          }}
          onScroll={handleScroll}
        >
          {listPlayers.length > 0 ? (
            listPlayers.map((player) => (
              <div 
                key={player.rank} 
                className={`flex items-center justify-between py-0.5 sm:py-1 md:py-2 lg:py-2.5 px-1 sm:px-1.5 md:px-3 lg:px-4 rounded-sm sm:rounded-md lg:rounded-lg transition-all duration-300 hover:bg-gray-700/50 ${
                  player.isUser ? 'bg-[#A578FD]/20 border border-[#A578FD]/50 shadow-lg shadow-[#A578FD]/20' : 'bg-[#252A40]/30'
                } min-h-[2.5rem]`}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 md:gap-3 lg:gap-4 min-w-0 flex-1">
                  <span className="text-white/70 w-2 sm:w-3 md:w-5 lg:w-6 text-xs sm:text-xs md:text-base font-bold flex-shrink-0">{player.rank}</span>
                  <span className={`font-medium text-xs sm:text-xs md:text-base ${player.isUser ? 'text-[#A578FD]' : 'text-white'} truncate`}>
                    {player.name}
                  </span>
                </div>
                <span className={`font-bold text-xs sm:text-xs md:text-base ${player.isUser ? 'text-[#A578FD]' : 'text-white'} flex-shrink-0 ml-1 sm:ml-1 md:ml-2`}>
                  {player.score}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <p className="text-xs sm:text-xs md:text-sm">No participants yet</p>
                <p className="text-xs mt-0.5 sm:mt-1">Be the first to complete the test!</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Scroll indicator - shows when there are more than 7 players */}
        {listPlayers.length > 7 && (
          <div className="absolute bottom-2 right-2 text-white/40 text-xs">
            
          </div>
        )}
      </div>
    </div>
  );
} 