"use client"

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "@/components/ui/loading";
import { Header } from "@/components/ui/header";
import { PrizePool } from "@/components/ui/prize-pool";
import { LeaderboardSection } from "@/components/ui/leaderboard-section";
import { DesktopOnly } from "@/components/ui/desktop-only";
import { useAnimationObserver } from "@/hooks/use-animation-observer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isMobileDevice } from "@/utils/device-detection";

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

  // Initialize animation observer
  useAnimationObserver();

  // Check if device is mobile
  useEffect(() => {
    setIsMobile(isMobileDevice());
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

  // Trigger animations after page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Mock leaderboard data - replace with real data from your backend
  const leaderboardPlayers = [
    { rank: 1, name: "Ikarus7654", score: 8456, avatar: "/images.jpg" },
    { rank: 2, name: "Ikarus1254", score: 8200, avatar: "/images.jpg" },
    { rank: 3, name: "Ikarus4483", score: 7786, avatar: "/download.jpg" },
    { rank: 74, name: "Ikarus4567", score: 5600 },
    { rank: 75, name: "Ikarus8285", score: 5300 },
    { rank: 76, name: "Ikarus4875 (You)", score: userScore?.score || 5162, isUser: true },
    { rank: 77, name: "Ikarus9895", score: 4800 },
    { rank: 78, name: "Ikarus5684", score: 4600 },
    { rank: 79, name: "Ikarus3395", score: 4200 },
  ];

  // Show loading while checking auth
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
        currentPage="home" 
        isPageLoaded={isPageLoaded}
        className="relative z-30"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-start justify-between px-4 lg:px-16 py-12 gap-8 lg:gap-16 relative overflow-visible">
        {/* Left Side - Score Details */}
        <div className={`flex-1 max-w-xs sm:max-w-sm lg:max-w-xl transition-all duration-1000 transform flex flex-col mt-5 ${isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '200ms' }}>
          {/* Stats */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <p className="text-white font-jost text-lg sm:text-2xl lg:text-3xl mb-3 sm:mb-4 lg:mb-6">
              {userScore?.wpm || 0} WPM | {userScore?.accuracy || 0}% Accuracy
            </p>
            <h1 className="text-[#A578FD] font-jost font-bold text-[68px] mb-6 sm:mb-8 lg:mb-12 leading-tight">
              Your Score: {userScore?.score || 0}
            </h1>
          </div>

          {/* Giveaway Button */}
          <button className="bg-[#A578FD] text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-xl font-jost font-bold text-xs sm:text-sm lg:text-base uppercase hover:bg-[#A578FD]/90 hover:shadow-lg hover:shadow-[#A578FD]/50 transition-all duration-300 transform hover:scale-105 hover-pop">
            Participate in the Giveaway
          </button>
        </div>

        {/* Prize Pool */}
        <div className="flex-shrink-0 hidden lg:block">
          <PrizePool />
        </div>
              
        {/* Right Side - New Leaderboard */}
        <div className={`flex-1 max-w-sm sm:max-w-lg lg:max-w-2xl transition-all duration-1000 transform flex flex-col min-h-0 ${isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '400ms' }}>
          <div className="h-full flex flex-col overflow-hidden">
            <LeaderboardSection 
              players={leaderboardPlayers}
              userScore={userScore?.score}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 transition-opacity duration-1000 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '600ms' }}>
        <h2 className="text-[#A578FD] font-faster-one text-2xl sm:text-4xl lg:text-5xl leading-tight tracking-wider">
          FASTEST
          <br />
          FINGERS
        </h2>
      </div>
    </main>
  );
}