import Image from "next/image";
import { LeaderboardPlayer } from "@/types/leaderboard";

interface LeaderboardPodiumProps {
  topPlayers: LeaderboardPlayer[];
}

export function LeaderboardPodium({ topPlayers }: LeaderboardPodiumProps) {
  // Ensure we have exactly 3 players for the podium, with placeholders for missing ones
  const getPlayerOrPlaceholder = (index: number, rank: number): LeaderboardPlayer | null => {
    if (topPlayers[index]) {
      return topPlayers[index];
    }
    
    // Return placeholder for missing players
    if (topPlayers.length > 0) { // Only show placeholders if there's at least one real player
      return {
        rank,
        name: rank === 2 ? "Join the contest!" : "Be next!",
        score: 0,
        avatar: undefined,
        isUser: false
      };
    }
    
    return null;
  };

  const first = getPlayerOrPlaceholder(0, 1);
  const second = getPlayerOrPlaceholder(1, 2);
  const third = getPlayerOrPlaceholder(2, 3);

  return (
    <>
      {/* Desktop Podium - Smaller Design */}
      <div className="hidden lg:block relative" style={{ width: '378px', height: '237px' }}>
        {/* Main background rectangle */}
        <div 
          className="absolute bg-[#1E2237]"
          style={{
            width: '378px',
            height: '110px',
            top: '127px',
            left: '0px',
            borderRadius: '13.3px'
          }}
        ></div>

        {/* Center podium (1st place) */}
        <div 
          className="absolute bg-[#252A40]"
          style={{
            width: '135px',
            height: '154px',
            left: '121.5px', // Centered: (378 - 135) / 2
            top: '82.5px',
            borderRadius: '33.2px 33.2px 0px 0px'
          }}
        ></div>

        {/* Crown above first place */}
        <div 
          className="absolute flex items-center justify-center"
          style={{
            width: '38px',
            height: '30px',
            left: '170px', // Centered above 1st place
            top: '0px'
          }}
        >
          <Image 
            src="/crow.png" 
            alt="Winner Crown" 
            width={38} 
            height={30}
            className="w-full h-full object-contain drop-shadow-lg"
            priority
          />
        </div>

        {/* First place player (center) */}
        {first && (
          <>
            {/* Avatar */}
            <div 
              className={`absolute rounded-full overflow-hidden ${first.score === 0 ? 'opacity-50' : ''}`}
              style={{
                width: '91px',
                height: '91px',
                left: '143.5px', // Centered
                top: '26px',
                border: `3.3px solid ${first.score === 0 ? '#666' : '#A578FD'}`
              }}
            >
              {first.avatar ? (
                <Image src={first.avatar} alt={first.name} width={91} height={91} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full ${first.score === 0 ? 'bg-gradient-to-b from-gray-400 to-gray-600' : 'bg-gradient-to-b from-purple-400 to-purple-600'}`}></div>
              )}
            </div>

            {/* Rank badge */}
            <div 
              className={`absolute ${first.score === 0 ? 'bg-gray-500' : 'bg-[#A578FD]'} flex items-center justify-center`}
              style={{
                width: '19px',
                height: '19px',
                left: '179.5px',
                top: '101px',
                borderRadius: '5.5px',
                transform: 'rotate(45deg)'
              }}
            >
              <span 
                className="text-white font-semibold"
                style={{
                  fontSize: '9px',
                  lineHeight: '11px',
                  transform: 'rotate(-45deg)'
                }}
              >
                1
              </span>
            </div>

            {/* Name */}
            <div 
              className={`absolute ${first.score === 0 ? 'text-gray-400' : 'text-white'} font-medium truncate`}
              style={{
                left: '135px',
                top: '151px',
                width: '108px',
                fontSize: '13.3px',
                lineHeight: '16px',
                fontFamily: 'Inter',
                textAlign: 'center'
              }}
            >
              {first.name}
            </div>

            {/* Score */}
            <div 
              className={`absolute ${first.score === 0 ? 'text-gray-500' : 'text-[#A578FD]'} font-bold`}
              style={{
                left: '135px',
                top: '174px',
                width: '108px',
                fontSize: '20.6px',
                lineHeight: '25px',
                fontFamily: 'Inter',
                textAlign: 'center'
              }}
            >
              {first.score === 0 ? '---' : first.score}
            </div>
          </>
        )}

        {/* Second place player (left) */}
        {second && (
          <>
            {/* Avatar */}
            <div 
              className={`absolute rounded-full overflow-hidden ${second.score === 0 ? 'opacity-50' : ''}`}
              style={{
                width: '75px',
                height: '75px',
                left: '24px',
                top: '87px',
                border: `3.3px solid ${second.score === 0 ? '#666' : '#009BD6'}`
              }}
            >
              {second.avatar ? (
                <Image src={second.avatar} alt={second.name} width={75} height={75} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full ${second.score === 0 ? 'bg-gradient-to-b from-gray-400 to-gray-600' : 'bg-gradient-to-b from-blue-400 to-blue-600'}`}></div>
              )}
            </div>

            {/* Rank badge */}
            <div 
              className={`absolute ${second.score === 0 ? 'bg-gray-500' : 'bg-[#009BD6]'} flex items-center justify-center`}
              style={{
                width: '19px',
                height: '19px',
                left: '61px',
                top: '147px',
                borderRadius: '5.5px',
                transform: 'rotate(45deg)'
              }}
            >
              <span 
                className="text-white font-semibold"
                style={{
                  fontSize: '9px',
                  lineHeight: '11px',
                  transform: 'rotate(-45deg)'
                }}
              >
                2
              </span>
            </div>

            {/* Name */}
            <div 
              className={`absolute ${second.score === 0 ? 'text-gray-400' : 'text-white'} font-medium truncate`}
              style={{
                left: '8px',
                top: '181px',
                width: '90px',
                fontSize: '13.3px',
                lineHeight: '16px',
                fontFamily: 'Inter',
                textAlign: 'center'
              }}
            >
              {second.name}
            </div>

            {/* Score */}
            <div 
              className={`absolute ${second.score === 0 ? 'text-gray-500' : 'text-[#009BD6]'} font-bold`}
              style={{
                left: '8px',
                top: '200px',
                width: '90px',
                fontSize: '16.6px',
                lineHeight: '20px',
                fontFamily: 'Inter',
                textAlign: 'center'
              }}
            >
              {second.score === 0 ? '---' : second.score}
            </div>
          </>
        )}

        {/* Third place player (right) */}
        {third && (
          <>
            {/* Avatar */}
            <div 
              className={`absolute rounded-full overflow-hidden ${third.score === 0 ? 'opacity-50' : ''}`}
              style={{
                width: '75px',
                height: '75px',
                left: '280px',
                top: '85px',
                border: `3.3px solid ${third.score === 0 ? '#666' : '#00D95F'}`
              }}
            >
              {third.avatar ? (
                <Image src={third.avatar} alt={third.name} width={75} height={75} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full ${third.score === 0 ? 'bg-gradient-to-b from-gray-400 to-gray-600' : 'bg-gradient-to-b from-green-400 to-green-600'}`}></div>
              )}
            </div>

            {/* Rank badge */}
            <div 
              className={`absolute ${third.score === 0 ? 'bg-gray-500' : 'bg-[#00D95F]'} flex items-center justify-center`}
              style={{
                width: '19px',
                height: '19px',
                left: '319px',
                top: '145px',
                borderRadius: '5.5px',
                transform: 'rotate(45deg)'
              }}
            >
              <span 
                className="text-white font-semibold"
                style={{
                  fontSize: '9px',
                  lineHeight: '11px',
                  transform: 'rotate(-45deg)'
                }}
              >
                3
              </span>
            </div>

            {/* Name */}
            <div 
              className={`absolute ${third.score === 0 ? 'text-gray-400' : 'text-white'} font-medium truncate`}
              style={{
                left: '270px',
                top: '178px',
                width: '90px',
                fontSize: '13.3px',
                lineHeight: '16px',
                fontFamily: 'Inter',
                textAlign: 'center'
              }}
            >
              {third.name}
            </div>

            {/* Score */}
            <div 
              className={`absolute ${third.score === 0 ? 'text-gray-500' : 'text-[#00D95F]'} font-bold`}
              style={{
                left: '270px',
                top: '204px',
                width: '90px',
                fontSize: '16.6px',
                lineHeight: '20px',
                fontFamily: 'Inter',
                textAlign: 'center'
              }}
            >
              {third.score === 0 ? '---' : third.score}
            </div>
          </>
        )}
      </div>

      {/* Mobile/Tablet Podium - More Compact Responsive Design */}
      <div className="lg:hidden relative w-full max-w-xs sm:max-w-sm md:max-w-md h-36 sm:h-44 md:h-52 mx-auto">
        {/* Main background rectangle */}
        <div 
          className="absolute bg-[#1E2237] rounded-lg sm:rounded-xl md:rounded-2xl"
          style={{
            width: '100%',
            height: '46%',
            top: '54%',
            left: '0%'
          }}
        ></div>

        {/* Center podium (1st place) */}
        <div 
          className="absolute bg-[#252A40]"
          style={{
            width: '36%',
            height: '65%',
            left: '32%', // Centered
            top: '35%',
            borderRadius: '20% 20% 0 0'
          }}
        ></div>

        {/* Crown above first place */}
        <div 
          className="absolute flex items-center justify-center"
          style={{
            width: '10%',
            height: '12%',
            left: '45%', // Centered above 1st place
            top: '0%'
          }}
        >
          <Image 
            src="/crow.png" 
            alt="Winner Crown" 
            width={50} 
            height={40}
            className="w-full h-full object-contain drop-shadow-lg"
            priority
          />
        </div>

        {/* First place player (center) */}
        {first && (
          <>
            {/* Avatar */}
            <div 
              className={`absolute rounded-full overflow-hidden border-2 sm:border-4 ${first.score === 0 ? 'border-gray-400 opacity-50' : 'border-[#A578FD]'}`}
              style={{
                width: '24%',
                height: '38%',
                left: '38%', // Centered
                top: '11%'
              }}
            >
              {first.avatar ? (
                <Image src={first.avatar} alt={first.name} width={121} height={121} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full ${first.score === 0 ? 'bg-gradient-to-b from-gray-400 to-gray-600' : 'bg-gradient-to-b from-purple-400 to-purple-600'}`}></div>
              )}
            </div>

            {/* Rank badge */}
            <div 
              className={`absolute ${first.score === 0 ? 'bg-gray-500' : 'bg-[#A578FD]'} flex items-center justify-center rounded`}
              style={{
                width: '5%',
                height: '8%',
                left: '47.5%',
                top: '43%',
                transform: 'rotate(45deg)',
                minWidth: '16px',
                minHeight: '16px'
              }}
            >
              <span 
                className="text-white font-semibold text-xs"
                style={{
                  transform: 'rotate(-45deg)'
                }}
              >
                1
              </span>
            </div>

            {/* Name */}
            <div 
              className={`absolute ${first.score === 0 ? 'text-gray-400' : 'text-white'} font-medium text-xs sm:text-sm md:text-base text-center truncate`}
              style={{
                left: '32%',
                top: '64%',
                width: '36%',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              {first.name}
            </div>

            {/* Score */}
            <div 
              className={`absolute ${first.score === 0 ? 'text-gray-500' : 'text-[#A578FD]'} font-bold text-sm sm:text-lg md:text-xl text-center`}
              style={{
                left: '32%',
                top: '73%',
                width: '36%'
              }}
            >
              {first.score === 0 ? '---' : first.score}
            </div>
          </>
        )}

        {/* Second place player (left) */}
        {second && (
          <>
            {/* Avatar */}
            <div 
              className={`absolute rounded-full overflow-hidden border-2 sm:border-4 ${second.score === 0 ? 'border-gray-400 opacity-50' : 'border-[#009BD6]'}`}
              style={{
                width: '20%',
                height: '32%',
                left: '6%',
                top: '37%'
              }}
            >
              {second.avatar ? (
                <Image src={second.avatar} alt={second.name} width={100} height={100} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full ${second.score === 0 ? 'bg-gradient-to-b from-gray-400 to-gray-600' : 'bg-gradient-to-b from-blue-400 to-blue-600'}`}></div>
              )}
            </div>

            {/* Rank badge */}
            <div 
              className={`absolute ${second.score === 0 ? 'bg-gray-500' : 'bg-[#009BD6]'} flex items-center justify-center rounded`}
              style={{
                width: '5%',
                height: '8%',
                left: '16%',
                top: '62%',
                transform: 'rotate(45deg)',
                minWidth: '16px',
                minHeight: '16px'
              }}
            >
              <span 
                className="text-white font-semibold text-xs"
                style={{
                  transform: 'rotate(-45deg)'
                }}
              >
                2
              </span>
            </div>

            {/* Name */}
            <div 
              className={`absolute ${second.score === 0 ? 'text-gray-400' : 'text-white'} font-medium text-xs sm:text-sm text-center truncate`}
              style={{
                left: '1%',
                top: '76%',
                width: '30%',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              {second.name}
            </div>

            {/* Score */}
            <div 
              className={`absolute ${second.score === 0 ? 'text-gray-500' : 'text-[#009BD6]'} font-bold text-sm sm:text-base text-center`}
              style={{
                left: '1%',
                top: '85%',
                width: '30%'
              }}
            >
              {second.score === 0 ? '---' : second.score}
            </div>
          </>
        )}

        {/* Third place player (right) */}
        {third && (
          <>
            {/* Avatar */}
            <div 
              className={`absolute rounded-full overflow-hidden border-2 sm:border-4 ${third.score === 0 ? 'border-gray-400 opacity-50' : 'border-[#00D95F]'}`}
              style={{
                width: '20%',
                height: '32%',
                left: '74%',
                top: '36%'
              }}
            >
              {third.avatar ? (
                <Image src={third.avatar} alt={third.name} width={100} height={100} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full ${third.score === 0 ? 'bg-gradient-to-b from-gray-400 to-gray-600' : 'bg-gradient-to-b from-green-400 to-green-600'}`}></div>
              )}
            </div>

            {/* Rank badge */}
            <div 
              className={`absolute ${third.score === 0 ? 'bg-gray-500' : 'bg-[#00D95F]'} flex items-center justify-center rounded`}
              style={{
                width: '5%',
                height: '8%',
                left: '84%',
                top: '61%',
                transform: 'rotate(45deg)',
                minWidth: '16px',
                minHeight: '16px'
              }}
            >
              <span 
                className="text-white font-semibold text-xs"
                style={{
                  transform: 'rotate(-45deg)'
                }}
              >
                3
              </span>
            </div>

            {/* Name */}
            <div 
              className={`absolute ${third.score === 0 ? 'text-gray-400' : 'text-white'} font-medium text-xs sm:text-sm text-center truncate`}
              style={{
                left: '69%',
                top: '75%',
                width: '30%',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              {third.name}
            </div>

            {/* Score */}
            <div 
              className={`absolute ${third.score === 0 ? 'text-gray-500' : 'text-[#00D95F]'} font-bold text-sm sm:text-base text-center`}
              style={{
                left: '69%',
                top: '84%',
                width: '30%'
              }}
            >
              {third.score === 0 ? '---' : third.score}
            </div>
          </>
        )}
      </div>
    </>
  );
} 