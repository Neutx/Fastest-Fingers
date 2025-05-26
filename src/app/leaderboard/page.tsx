"use client"

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "@/components/ui/loading";
import { LeaderboardSection } from "@/components/ui/leaderboard-section";
import { DesktopOnly } from "@/components/ui/desktop-only";
import { useAnimationObserver } from "@/hooks/use-animation-observer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isMobileDevice } from "@/utils/device-detection";
import Image from "next/image";

interface UserScore {
  wpm: number;
  accuracy: number;
  score: number;
}

export default function LeaderboardPage() {
  const { user, loading, signOut } = useAuth();
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

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
    <main className="h-screen w-screen bg-black relative flex flex-col overflow-hidden scrollbar-hide">
      {/* Header */}
      <header className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 transition-opacity duration-800 flex-shrink-0 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-4 sm:gap-8 lg:gap-12">
          <Image
            src="/kreo.png"
            alt="KREO Logo"
            width={100}
            height={31}
            className="hover-pop sm:w-[120px] sm:h-[37px] lg:w-[142px] lg:h-[44px]"
          />
          <nav className="flex items-center gap-4 sm:gap-8 lg:gap-12">
            <button 
              onClick={() => router.push('/contest')}
              className="text-white font-jost text-sm sm:text-lg lg:text-xl hover:text-[#A578FD] transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => router.push('/leaderboard')}
              className="text-[#A578FD] font-jost text-sm sm:text-lg lg:text-xl"
            >
              Leaderboard
            </button>
            <button 
              onClick={() => router.push('/giveaway')}
              className="text-white font-jost text-sm sm:text-lg lg:text-xl hover:text-[#A578FD] transition-colors"
            >
              Giveaway
            </button>
          </nav>
        </div>
        <button 
          onClick={handleLogout}
          className="text-white font-jost text-sm sm:text-lg lg:text-xl hover:text-[#A578FD] transition-colors"
        >
          Log Out
        </button>
      </header>

      {/* Prize Pool - Absolutely positioned, doesn't affect layout */}
      {/* 
        POSITIONING CONTROLS:
        - Horizontal (X-axis): Change 'left-8 sm:left-12 lg:left-20' values
          - left-4 = 16px, left-8 = 32px, left-12 = 48px, left-16 = 64px, left-20 = 80px
        - Vertical (Y-axis): Change 'top-1/3' value
          - top-1/4 = 25% from top, top-1/3 = 33% from top, top-1/2 = 50% from top
          - Or use specific values like 'top-32' (128px), 'top-40' (160px), 'top-48' (192px)
      */}
      <div className={`absolute left-12 sm:left-16 lg:left-24 top-1/4 transform z-10 transition-all duration-1000 ${isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '200ms' }}>
        <div className="relative">
          <div className="border border-white/30 rounded-lg bg-black/20 backdrop-blur-sm hover-pop">
            {/* Red Label */}
            <div className="absolute -top-3 right-4">
              <div className="bg-red-600 text-white px-4 py-1 rounded text-xs font-bold uppercase tracking-wide">
                CURR PRIZE POOL
              </div>
            </div>

            {/* Content */}
            <div className="pt-6 pb-4 px-6">
              <div className="text-white font-bold text-[42px] leading-none mb-1">
                ₹10,000
              </div>
              <div className="text-white/50 text-sm">
                5000 + 20 × 250
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Centered Leaderboard */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-16 py-2 sm:py-4 lg:py-6 relative overflow-hidden min-h-0">
        {/* Centered Leaderboard */}
        <div className={`max-w-4xl w-full transition-all duration-1000 transform flex flex-col min-h-0 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
          <div className="h-full flex flex-col overflow-hidden">
            <LeaderboardSection 
              players={leaderboardPlayers}
              userScore={userScore?.score}
            />
          </div>
        </div>
      </div>
    </main>
  );
}