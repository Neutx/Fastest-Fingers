import Image from "next/image";
import { useRef } from "react";

interface GiveawayModalProps {
  isOpen: boolean;
  onClose: () => void;
  userScore: {
    wpm: number;
    accuracy: number;
    score: number;
  } | null;
  userName: string;
}

interface CardTier {
  name: string;
  wpmRange: string;
  description: string;
  bgGradient: string;
  image: string;
  minWpm: number;
  maxWpm: number;
}

const cardTiers: CardTier[] = [
  {
    name: "Beginner",
    wpmRange: "< 2500",
    description: "You are probably\nstill using dial up connection",
    bgGradient: "bg-violet-400",
    image: "/cards/beginner-card.png", // placeholder
    minWpm: 0,
    maxWpm: 2499
  },
  {
    name: "Casual",
    wpmRange: "2.5K - 5K",
    description: "Are you the sum of all numbers divided by how many there are? Because you're average.",
    bgGradient: "bg-violet-400",
    image: "/cards/casual-card.png", // placeholder
    minWpm: 2500,
    maxWpm: 4999
  },
  {
    name: "Pro",
    wpmRange: "5K - 8K",
    description: "You're the fastest!\n(in your friend circle)",
    bgGradient: "bg-violet-400",
    image: "/cards/pro-card.png", // placeholder
    minWpm: 5000,
    maxWpm: 7999
  },
  {
    name: "Elite",
    wpmRange: "8K - 10K",
    description: "It&apos;s not your fault. Repeat\nafter us. It&apos;s not your fault",
    bgGradient: "bg-violet-400",
    image: "/cards/elite-card.png", // placeholder
    minWpm: 8000,
    maxWpm: 9999
  },
  {
    name: "Godlike",
    wpmRange: "10K+",
    description: "O Dear Lord! Please\nBless us all",
    bgGradient: "bg-violet-400",
    image: "/cards/godlike-card.png", // placeholder
    minWpm: 10000,
    maxWpm: Infinity
  }
];

function getCardTier(score: number): CardTier {
  const tier = cardTiers.find(tier => score >= tier.minWpm && score <= tier.maxWpm);
  return tier || cardTiers[0]; // Default to beginner
}

function getPercentileText(score: number): string {
  // Simple calculation - in a real app you'd calculate this from actual data
  if (score < 2500) return "10";
  if (score < 5000) return "25";
  if (score < 8000) return "50";
  if (score < 10000) return "75";
  return "90";
}

export function GiveawayModal({ isOpen, onClose, userScore, userName }: GiveawayModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardTier = getCardTier(userScore?.score || 0);
  const percentile = getPercentileText(userScore?.score || 0);

  if (!isOpen || !userScore) return null;

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const domtoimage = (await import('dom-to-image')).default;
      
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        quality: 1.0,
      });

      const link = document.createElement('a');
      link.download = `${userName}-${cardTier.name}-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
      alert('Unable to download card. Please try again.');
    }
  };

  const handleVisitTwitter = () => {
    window.open("https://x.com/isawsukul", "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-lg mx-auto">
        {/* Modal Container */}
        <div className="bg-[#F1F1F1] rounded-[26px] border-[11px] border-white p-8 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

                    {/* Card */}
          <div className="flex justify-center mb-8">
            <div ref={cardRef} className="w-60 h-96 relative bg-violet-400 rounded-2xl overflow-hidden">
              {/* Card Container */}
              <div className="w-60 h-96 left-0 top-0 absolute bg-violet-400 rounded-2xl">
                {/* Card Image */}
                <div className="w-52 h-36 left-4 top-10 absolute rounded-lg overflow-hidden">
                  <Image 
                    src={cardTier.image} 
                    alt={`${cardTier.name} card`}
                    width={208}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Badge */}
                <div className="w-20 h-5 left-4 top-3 absolute bg-gradient-to-b from-yellow-400 to-yellow-400 rounded-[40px] flex items-center justify-center">
                  <div className="text-center justify-start text-stone-900 text-xs font-bold font-['Inter']">{cardTier.name}</div>
                </div>

                {/* Kreo Logo */}
                <div className="w-12 h-5 left-[170px] top-3 absolute flex items-center justify-center">
                  <Image 
                    src="/kreo.svg" 
                    alt="Kreo Logo"
                    width={48}
                    height={20}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Card Content Bottom Section */}
                <div className="w-52 h-40 left-4 top-[182px] absolute bg-violet-600">
                  {/* Username */}
                  <div className="w-full top-[16px] absolute text-center text-white text-lg font-semibold font-['Jost']">
                    {userName}
                  </div>

                  {/* Score */}
                  <div className="w-full top-[50px] right-[6px] absolute text-center text-white text-3xl font-normal font-['Dela_Gothic_One']">
                    {cardTier.wpmRange}
                  </div>

                  {/* Description */}
                  <div className="w-full px-2 top-[100px] right-[2px] absolute text-center text-white text-xs font-normal font-['Jost'] leading-none whitespace-pre-line">
                    {cardTier.description}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-[#252525] font-['Montserrat'] text-[21px] leading-[31px] space-y-4">
            <p>
                             Well Done! You&apos;re ahead than{" "}
               <span className="text-[#A578FD] font-extrabold">x</span>
               <span className="text-[#A578FD] font-bold">{percentile}%</span>{" "}
               people. Although you couldn&apos;t win, you still have a chance to win the Kreo Hive 65.
            </p>

                         <p>Here&apos;s how you can win:</p>

            <div className="space-y-2">
              <p>
                1. Download{" "}
                <button
                  onClick={handleDownloadCard}
                  className="text-[#1557FF] underline hover:text-[#1557FF]/80 transition-colors cursor-pointer"
                >
                  your card.
                </button>
              </p>
              <p>
                2. Visit{" "}
                <button
                  onClick={handleVisitTwitter}
                  className="text-[#1557FF] underline hover:text-[#1557FF]/80 transition-colors"
                >
                  X/isawsukul
                </button>{" "}
                and post it as a QT.
              </p>
              <p>3. One lucky winner to get the Kreo Hive 65</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 