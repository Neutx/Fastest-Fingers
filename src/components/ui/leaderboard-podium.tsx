import Image from "next/image";

interface LeaderboardPlayer {
  rank: number;
  name: string;
  score: number;
  avatar?: string;
}

interface LeaderboardPodiumProps {
  topPlayers: LeaderboardPlayer[];
}

export function LeaderboardPodium({ topPlayers }: LeaderboardPodiumProps) {
  // Ensure we have exactly 3 players for the podium
  const [first, second, third] = topPlayers.slice(0, 3);

  return (
    <>
      {/* Desktop Podium - Original Design */}
      <div className="hidden lg:block relative" style={{ width: '504.62px', height: '315.96px' }}>
        {/* Main background rectangle */}
        <div 
          className="absolute bg-[#1E2237]"
          style={{
            width: '504.62px',
            height: '146.38px',
            top: '169.58px',
            left: '0px',
            borderRadius: '17.706px'
          }}
        ></div>

        {/* Center podium (1st place) */}
        <div 
          className="absolute bg-[#252A40]"
          style={{
            width: '180.01px',
            height: '205.97px',
            left: '162.31px', // Centered: (504.62 - 180.01) / 2
            top: '109.99px',
            borderRadius: '44.2651px 44.2651px 0px 0px'
          }}
        ></div>

        {/* Crown above first place */}
        <div 
          className="absolute flex items-center justify-center"
          style={{
            width: '50.17px',
            height: '39.57px',
            left: '227.23px', // Centered above 1st place
            top: '0px'
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
              className="absolute rounded-full overflow-hidden"
              style={{
                width: '120.99px',
                height: '120.99px',
                left: '191.82px', // Centered
                top: '34.74px',
                border: '4.42651px solid #A578FD'
              }}
            >
              {first.avatar ? (
                <Image src={first.avatar} alt={first.name} width={121} height={121} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-purple-400 to-purple-600"></div>
              )}
            </div>

            {/* Rank badge */}
            <div 
              className="absolute bg-[#A578FD] flex items-center justify-center"
              style={{
                width: '25.08px',
                height: '25.08px',
                left: '239.77px',
                top: '135.07px',
                borderRadius: '7.37752px',
                transform: 'rotate(45deg)'
              }}
            >
              <span 
                className="text-white font-semibold"
                style={{
                  fontSize: '11.804px',
                  lineHeight: '14px',
                  transform: 'rotate(-45deg)'
                }}
              >
                1
              </span>
            </div>

            {/* Name */}
            <div 
              className="absolute text-white font-medium"
              style={{
                left: '213.01px',
                top: '201.03px',
                fontSize: '17.706px',
                lineHeight: '21px',
                fontFamily: 'Inter'
              }}
            >
              {first.name}
            </div>

            {/* Score */}
            <div 
              className="absolute text-[#A578FD] font-bold"
              style={{
                left: '215.5px',
                top: '232.15px',
                fontSize: '27.4453px',
                lineHeight: '33px',
                fontFamily: 'Inter'
              }}
            >
              {first.score}
            </div>
          </>
        )}

        {/* Second place player (left) */}
        {second && (
          <>
            {/* Avatar */}
            <div 
              className="absolute rounded-full overflow-hidden"
              style={{
                width: '100.33px',
                height: '100.33px',
                left: '31.92px',
                top: '115.89px',
                border: '4.42651px solid #009BD6'
              }}
            >
              {second.avatar ? (
                <Image src={second.avatar} alt={second.name} width={100} height={100} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600"></div>
              )}
            </div>

            {/* Rank badge */}
            <div 
              className="absolute bg-[#009BD6] flex items-center justify-center"
              style={{
                width: '25.08px',
                height: '25.08px',
                left: '81.12px',
                top: '195.57px',
                borderRadius: '7.37752px',
                transform: 'rotate(45deg)'
              }}
            >
              <span 
                className="text-white font-semibold"
                style={{
                  fontSize: '11.804px',
                  lineHeight: '14px',
                  transform: 'rotate(-45deg)'
                }}
              >
                2
              </span>
            </div>

            {/* Name */}
            <div 
              className="absolute text-white font-medium"
              style={{
                left: '35.23px',
                top: '241.31px',
                fontSize: '17.706px',
                lineHeight: '21px',
                fontFamily: 'Inter'
              }}
            >
              {second.name}
            </div>

            {/* Score */}
            <div 
              className="absolute text-[#009BD6] font-bold"
              style={{
                left: '52px',
                top: '267px',
                fontSize: '22.1326px',
                lineHeight: '27px',
                fontFamily: 'Inter'
              }}
            >
              {second.score}
            </div>
          </>
        )}

        {/* Third place player (right) */}
        {third && (
          <>
            {/* Avatar */}
            <div 
              className="absolute rounded-full overflow-hidden"
              style={{
                width: '100.33px',
                height: '100.33px',
                left: '373.24px',
                top: '112.94px',
                border: '4.42651px solid #00D95F'
              }}
            >
              {third.avatar ? (
                <Image src={third.avatar} alt={third.name} width={100} height={100} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-green-400 to-green-600"></div>
              )}
            </div>

            {/* Rank badge */}
            <div 
              className="absolute bg-[#00D95F] flex items-center justify-center"
              style={{
                width: '25.08px',
                height: '25.08px',
                left: '424.91px',
                top: '194.09px',
                borderRadius: '7.37752px',
                transform: 'rotate(45deg)'
              }}
            >
              <span 
                className="text-white font-semibold"
                style={{
                  fontSize: '11.804px',
                  lineHeight: '14px',
                  transform: 'rotate(-45deg)'
                }}
              >
                3
              </span>
            </div>

            {/* Name */}
            <div 
              className="absolute text-white font-medium"
              style={{
                left: '380.09px',
                top: '236.88px',
                fontSize: '17.706px',
                lineHeight: '21px',
                fontFamily: 'Inter'
              }}
            >
              {third.name}
            </div>

            {/* Score */}
            <div 
              className="absolute text-[#00D95F] font-bold"
              style={{
                left: '400px',
                top: '272px',
                fontSize: '22.1326px',
                lineHeight: '27px',
                fontFamily: 'Inter'
              }}
            >
              {third.score}
            </div>
          </>
        )}
      </div>

      {/* Mobile/Tablet Podium - Responsive Design */}
      <div className="lg:hidden relative w-full max-w-xs sm:max-w-md md:max-w-lg h-48 sm:h-60 md:h-72 mx-auto">
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
              className="absolute rounded-full overflow-hidden border-2 sm:border-4 border-[#A578FD]"
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
                <div className="w-full h-full bg-gradient-to-b from-purple-400 to-purple-600"></div>
              )}
            </div>

            {/* Rank badge */}
            <div 
              className="absolute bg-[#A578FD] flex items-center justify-center rounded"
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
              className="absolute text-white font-medium text-xs sm:text-sm md:text-base text-center"
              style={{
                left: '32%',
                top: '64%',
                width: '36%'
              }}
            >
              {first.name}
            </div>

            {/* Score */}
            <div 
              className="absolute text-[#A578FD] font-bold text-sm sm:text-lg md:text-xl text-center"
              style={{
                left: '32%',
                top: '73%',
                width: '36%'
              }}
            >
              {first.score}
            </div>
          </>
        )}

        {/* Second place player (left) */}
        {second && (
          <>
            {/* Avatar */}
            <div 
              className="absolute rounded-full overflow-hidden border-2 sm:border-4 border-[#009BD6]"
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
                <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600"></div>
              )}
            </div>

            {/* Rank badge */}
            <div 
              className="absolute bg-[#009BD6] flex items-center justify-center rounded"
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
              className="absolute text-white font-medium text-xs sm:text-sm text-center"
              style={{
                left: '1%',
                top: '76%',
                width: '30%'
              }}
            >
              {second.name}
            </div>

            {/* Score */}
            <div 
              className="absolute text-[#009BD6] font-bold text-sm sm:text-base text-center"
              style={{
                left: '1%',
                top: '85%',
                width: '30%'
              }}
            >
              {second.score}
            </div>
          </>
        )}

        {/* Third place player (right) */}
        {third && (
          <>
            {/* Avatar */}
            <div 
              className="absolute rounded-full overflow-hidden border-2 sm:border-4 border-[#00D95F]"
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
                <div className="w-full h-full bg-gradient-to-b from-green-400 to-green-600"></div>
              )}
            </div>

            {/* Rank badge */}
            <div 
              className="absolute bg-[#00D95F] flex items-center justify-center rounded"
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
              className="absolute text-white font-medium text-xs sm:text-sm text-center"
              style={{
                left: '69%',
                top: '75%',
                width: '30%'
              }}
            >
              {third.name}
            </div>

            {/* Score */}
            <div 
              className="absolute text-[#00D95F] font-bold text-sm sm:text-base text-center"
              style={{
                left: '69%',
                top: '84%',
                width: '30%'
              }}
            >
              {third.score}
            </div>
          </>
        )}
      </div>
    </>
  );
} 