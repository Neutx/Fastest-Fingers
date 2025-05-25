import { LeaderboardPodium } from "./leaderboard-podium";

interface LeaderboardPlayer {
  rank: number;
  name: string;
  score: number;
  avatar?: string;
  isUser?: boolean;
}

interface LeaderboardSectionProps {
  players: LeaderboardPlayer[];
  userScore?: number;
}

export function LeaderboardSection({ players, userScore }: LeaderboardSectionProps) {
  // Get top 3 for podium
  const topThree = players.slice(0, 3);
  
  // Get remaining players for the list (starting from rank 4 or user's position)
  const listPlayers = players.slice(3);

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Podium Section - Centered */}
      <div className="flex-1 flex items-center justify-center relative z-20">
        <LeaderboardPodium topPlayers={topThree} />
      </div>

      {/* Leaderboard List - overlapping only at the bottom of podiums */}
      <div className="flex-1 bg-[#1E2237] backdrop-blur-sm rounded-2xl sm:rounded-3xl p-2 sm:p-4 lg:p-5 overflow-hidden flex flex-col min-h-0 -mt-[30px] sm:-mt-[36px] lg:-mt-[42px] pt-[36px] sm:pt-[42px] lg:pt-[48px] relative z-10">
        <div className="flex-1 overflow-y-auto space-y-1 sm:space-y-2 scrollbar-hide">
          {listPlayers.map((player) => (
            <div 
              key={player.rank} 
              className={`flex items-center justify-between py-2 sm:py-3 lg:py-3 px-3 sm:px-4 lg:px-5 rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-gray-700/50 ${
                player.isUser ? 'bg-[#A578FD]/20 border border-[#A578FD]/50 shadow-lg shadow-[#A578FD]/20' : 'bg-[#252A40]/30'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                <span className="text-white/70 w-5 sm:w-6 lg:w-7 text-sm sm:text-base lg:text-lg font-bold">{player.rank}</span>
                <span className={`font-medium text-sm sm:text-base lg:text-lg ${player.isUser ? 'text-[#A578FD]' : 'text-white'} truncate`}>
                  {player.name}
                </span>
              </div>
              <span className={`font-bold text-sm sm:text-base lg:text-lg ${player.isUser ? 'text-[#A578FD]' : 'text-white'} flex-shrink-0`}>
                {player.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 