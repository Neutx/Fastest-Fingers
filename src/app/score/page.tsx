"use client"

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { LoadingAnimation } from "@/components/ui/loading";
import { Header } from "@/components/ui/header";
import { PrizePool } from "@/components/ui/prize-pool";
import { LeaderboardSection } from "@/components/ui/leaderboard-section";
import { DesktopOnly } from "@/components/ui/desktop-only";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isMobileDevice } from "@/utils/device-detection";
import { GiveawayModal } from "@/components/ui/giveaway-modal";

interface UserScore {
  wpm: number;
  accuracy: number;
  score: number;
}

export default function ScorePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showGiveawayModal, setShowGiveawayModal] = useState(false);

  // Fetch real leaderboard data
  const { allPlayers, isLoading: leaderboardLoading } = useLeaderboard(user?.uid);

  // Check if device is mobile and listen for resize events
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };

    // Check on mount
    checkMobile();

    const resizeHandler = () => checkMobile();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

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

  // Trigger page loaded state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Memoize display data to prevent unnecessary recalculations
  const displayData = useMemo(() => {
    if (leaderboardLoading) {
      return [
          { rank: 1, name: "Loading...", score: 0 },
          { rank: 2, name: "Loading...", score: 0 },
          { rank: 3, name: "Loading...", score: 0 },
      ];
    }

    if (allPlayers.length === 0) {
      return [
          { rank: 1, name: "Be the first!", score: 0 },
          { rank: 2, name: "Complete the test", score: 0 },
          { rank: 3, name: "Join the leaderboard", score: 0 },
      ];
    }

    return allPlayers;
  }, [allPlayers, leaderboardLoading]);

  // Show loading while checking auth or loading leaderboard
  if (loading) {
    return <LoadingAnimation />;
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  // Show desktop-only message for mobile devices
  if (isMobile) {
    return <DesktopOnly />;
  }

  return (
    <main className="h-screen w-screen bg-black relative flex flex-col overflow-hidden">
      {/* Header */}
      <Header 
        currentPage="giveaway" 
        isPageLoaded={isPageLoaded}
        className="relative z-30"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-start justify-between px-3 lg:px-12 py-6 lg:py-8 gap-6 lg:gap-12 relative overflow-visible">
        {/* Left Side - Score Details and Prize Pool */}
        <div className="flex-1 max-w-xs sm:max-w-sm lg:max-w-lg flex flex-col gap-6">
          {/* Score Details */}
          <div className={`transition-all duration-1000 transform flex flex-col mt-20 ${isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '200ms' }}>
            {/* Stats */}
            <div className="mb-2 sm:mb-3 lg:mb-4">
              <p className="text-white font-jost text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 lg:mb-4">
                {userScore?.wpm || 0} WPM | {userScore?.accuracy || 0}% Accuracy
              </p>
              <h1 className="text-[#A578FD] font-jost font-bold text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 lg:mb-6 leading-tight">
                Your Score: {userScore?.score || 0}
              </h1>
            </div>

            {/* Giveaway Button */}
            <button 
              onClick={() => setShowGiveawayModal(true)}
              className="bg-[#A578FD] text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl font-jost font-bold text-xs sm:text-sm lg:text-sm uppercase hover:bg-[#A578FD]/90 transition-colors duration-200 cursor-pointer w-fit"
            >
              Participate in the Giveaway
            </button>
          </div>

          {/* Prize Pool */}
          <div className={`transition-all duration-1000 transform ${isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '300ms' }}>
            <PrizePool />
          </div>
        </div>
              
        {/* Right Side - Leaderboard */}
        <div className={`flex-1 max-w-sm sm:max-w-md lg:max-w-xl transition-all duration-1000 transform flex flex-col min-h-0 ${isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '400ms' }}>
          <div className="h-full flex flex-col overflow-hidden">
            <LeaderboardSection 
              players={displayData}
              userScore={userScore?.score}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div 
        className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6"
        style={{
          opacity: isPageLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease-out 0.6s'
        }}
      >
        <h2 className="text-[#A578FD] font-faster-one text-xl sm:text-2xl lg:text-3xl leading-tight tracking-wider">
          FASTEST
          <br />
          FINGERS
        </h2>
      </div>

      {/* Giveaway Modal */}
      <GiveawayModal
        isOpen={showGiveawayModal}
        onClose={() => setShowGiveawayModal(false)}
        userScore={userScore}
        userName={user?.displayName || "User"}
      />
    </main>
  );
}