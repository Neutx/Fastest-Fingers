import { LeaderboardPodium } from "./leaderboard-podium";
import { LeaderboardPlayer } from "@/types/leaderboard";

interface LeaderboardSectionProps {
  players: LeaderboardPlayer[];
  userScore?: number;
}

export function LeaderboardSection({ players }: LeaderboardSectionProps) {
  // Get top 3 for podium
  const topThree = players.slice(0, 3);
  
  // Get remaining players for the list (starting from rank 4 or user's position)
  const listPlayers = players.slice(3);

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Podium Section - Centered */}
      <div className="flex-1 flex items-center justify-center relative z-20 px-2 sm:px-4">
        <LeaderboardPodium topPlayers={topThree} />
      </div>

      {/* Leaderboard List - overlapping only at the bottom of podiums */}
      <div className="flex-1 bg-[#1E2237] backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-2 sm:p-3 md:p-4 lg:p-5 overflow-hidden flex flex-col min-h-0 -mt-[20px] sm:-mt-[24px] md:-mt-[30px] lg:-mt-[36px] pt-[26px] sm:pt-[30px] md:pt-[36px] lg:pt-[42px] relative z-10">
        <div className="flex-1 overflow-y-auto space-y-1 sm:space-y-1.5 md:space-y-2 scrollbar-hide">
          {listPlayers.map((player) => (
            <div 
              key={player.rank} 
              className={`flex items-center justify-between py-1.5 sm:py-2 md:py-2.5 lg:py-3 px-2 sm:px-3 md:px-4 lg:px-5 rounded-md sm:rounded-lg md:rounded-xl transition-all duration-300 hover:bg-gray-700/50 ${
                player.isUser ? 'bg-[#A578FD]/20 border border-[#A578FD]/50 shadow-lg shadow-[#A578FD]/20' : 'bg-[#252A40]/30'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 min-w-0 flex-1">
                <span className="text-white/70 w-4 sm:w-5 md:w-6 lg:w-7 text-xs sm:text-sm md:text-base lg:text-lg font-bold flex-shrink-0">{player.rank}</span>
                <span className={`font-medium text-xs sm:text-sm md:text-base lg:text-lg ${player.isUser ? 'text-[#A578FD]' : 'text-white'} truncate`}>
                  {player.name}
                </span>
              </div>
              <span className={`font-bold text-xs sm:text-sm md:text-base lg:text-lg ${player.isUser ? 'text-[#A578FD]' : 'text-white'} flex-shrink-0 ml-2`}>
                {player.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 