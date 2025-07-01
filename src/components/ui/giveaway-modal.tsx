import { useRef, useState, useEffect } from "react";
import { useContestSettings } from "@/hooks/use-contest-settings";
import { useCardSettings } from "@/hooks/use-card-settings";

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

// Helper function to convert image URL to base64
const imageToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = () => {
      // If CORS fails, resolve with original URL
      resolve(url);
    };
    img.src = url;
  });
};

function getPercentileText(score: number): string {
  // Simple calculation - in a real app you'd calculate this from actual data
  if (score < 2500) return "10";
  if (score < 5000) return "25";
  if (score < 8000) return "50";
  if (score < 10000) return "75";
  return "90";
}

export function GiveawayModal({ isOpen, onClose, userScore, userName }: GiveawayModalProps) {
  const { tweetLink } = useContestSettings();
  const { getCardTier } = useCardSettings();
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardImageBase64, setCardImageBase64] = useState<string>('');
  const [kreoLogoBase64, setKreoLogoBase64] = useState<string>('');
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  
  const cardTier = getCardTier(userScore?.score || 0);
  const percentile = getPercentileText(userScore?.score || 0);
  const formattedScore = (() => {
    const score = userScore?.score || 0;
    if (score >= 1000) {
      // Format as e.g. 5K, 7.5K, etc.
      const thousands = score / 1000;
      // If the thousands part is an integer, don't keep decimals
      return Number.isInteger(thousands)
        ? `${thousands}K`
        : `${thousands.toFixed(1)}K`;
    }
    return score.toString();
  })();

  // Preload and convert images to base64 when modal opens
  useEffect(() => {
    if (!isOpen || !userScore) return;

    const loadImages = async () => {
      setIsLoadingImages(true);
      try {
        const [cardBase64, logoBase64] = await Promise.all([
          imageToBase64(cardTier.imageUrl),
          imageToBase64('/kreo.svg')
        ]);
        setCardImageBase64(cardBase64);
        setKreoLogoBase64(logoBase64);
      } catch (error) {
        console.error('Error loading images:', error);
        // Fallback to original URLs
        setCardImageBase64(cardTier.imageUrl);
        setKreoLogoBase64('/kreo.svg');
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadImages();
  }, [isOpen, userScore, cardTier.imageUrl]);

  if (!isOpen || !userScore) return null;

  const handleDownloadCard = async () => {
    if (!cardRef.current || isLoadingImages) return;

    try {
      const domtoimage = (await import('dom-to-image')).default;
      
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        quality: 1.0,
        width: 240,
        height: 384,
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
    const link = tweetLink || "https://x.com/isawsukul";
    window.open(link, "_blank", "noopener,noreferrer");
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
                  {isLoadingImages ? (
                    <div className="w-full h-full bg-gray-300 animate-pulse" />
                  ) : (
                    <img 
                      src={cardImageBase64 || cardTier.imageUrl} 
                    alt={`${cardTier.name} card`}
                    width={208}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                  )}
                </div>

                {/* Badge */}
                <div className="w-20 h-5 left-4 top-3 absolute bg-gradient-to-b from-yellow-400 to-yellow-400 rounded-[40px] flex items-center justify-center">
                  <div className="text-center justify-start text-stone-900 text-xs font-bold font-['Inter']">{cardTier.name}</div>
                </div>

                {/* Kreo Logo */}
                <div className="w-12 h-5 left-[170px] top-3 absolute flex items-center justify-center">
                  {isLoadingImages ? (
                    <div className="w-full h-full bg-gray-300 animate-pulse rounded" />
                  ) : (
                    <img 
                      src={kreoLogoBase64 || '/kreo.svg'} 
                    alt="Kreo Logo"
                    width={48}
                    height={20}
                    className="w-full h-full object-contain"
                  />
                  )}
                </div>

                {/* Card Content Bottom Section */}
                <div className="w-52 h-40 left-4 top-[182px] absolute bg-violet-600">
                  {/* Username */}
                  <div className="w-full top-[16px] absolute text-center text-white text-lg font-semibold font-['Jost']">
                    {userName}
                  </div>

                  {/* Score */}
                  <div className="w-full top-[50px] right-[6px] absolute text-center text-white text-3xl font-normal font-['Dela_Gothic_One']">
                    {formattedScore}
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
                             Well Done! You&apos;re ahead of{" "}
               <span className="text-[#A578FD] font-bold">{percentile}%</span>{" "}
               people. Although you couldn&apos;t win, you still have a chance to win the Kreo Hive 65.
            </p>

                         <p>Here&apos;s how you can win:</p>

            <div className="space-y-2">
              <p>
                1. Download{" "}
                <button
                  onClick={handleDownloadCard}
                  disabled={isLoadingImages}
                  className="text-[#1557FF] underline hover:text-[#1557FF]/80 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  your card{isLoadingImages ? " (loading...)" : "."}
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