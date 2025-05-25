"use client"

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PrizePool } from "@/components/ui/prize-pool";
import { useAnimationObserver } from "@/hooks/use-animation-observer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Menu, X } from "lucide-react";
import Image from "next/image";

interface UserScore {
  wpm: number;
  accuracy: number;
  score: number;
}

export default function ScorePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize animation observer
  useAnimationObserver();

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

  // Don't show loading animation - just wait for auth check

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black relative flex flex-col">
      {/* Header */}
      <header className={`relative z-30 flex items-center justify-between px-8 py-6 transition-opacity duration-800 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Logo */}
        <Image
          src="/kreo.png"
          alt="KREO Logo"
          width={142}
          height={44}
          className="hover-pop"
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          <button 
            onClick={() => router.push('/homepage')}
            className="text-white font-jost text-xl hover:text-[#A578FD] transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => router.push('/leaderboard')}
            className="text-white font-jost text-xl hover:text-[#A578FD] transition-colors"
          >
            Leaderboard
          </button>
          <button 
            onClick={() => router.push('/giveaway')}
            className="text-white font-jost text-xl hover:text-[#A578FD] transition-colors"
          >
            Giveaway
          </button>
          <button 
            onClick={handleLogout}
            className="text-white font-jost text-xl hover:text-[#A578FD] transition-colors"
          >
            Log Out
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:text-[#A578FD] transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/20 md:hidden">
            <div className="flex flex-col py-4">
              <button 
                onClick={() => {
                  router.push('/homepage')
                  setIsMobileMenuOpen(false)
                }}
                className="text-white font-jost text-lg hover:text-[#A578FD] transition-colors py-3 px-8 text-left"
              >
                Home
              </button>
              <button 
                onClick={() => {
                  router.push('/leaderboard')
                  setIsMobileMenuOpen(false)
                }}
                className="text-white font-jost text-lg hover:text-[#A578FD] transition-colors py-3 px-8 text-left"
              >
                Leaderboard
              </button>
              <button 
                onClick={() => {
                  router.push('/giveaway')
                  setIsMobileMenuOpen(false)
                }}
                className="text-white font-jost text-lg hover:text-[#A578FD] transition-colors py-3 px-8 text-left"
              >
                Giveaway
              </button>
              <button 
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="text-white font-jost text-lg hover:text-[#A578FD] transition-colors py-3 px-8 text-left"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between px-4 lg:px-16 py-12 gap-8 lg:gap-16 relative overflow-visible">
        {/* Left Side - Score Details */}
        <div className={`flex-1 max-w-xl transition-all duration-1000 transform ${isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '200ms' }}>
          {/* Stats */}
          <div className="mb-12">
            <p className="text-white font-jost text-3xl mb-6">
              {userScore?.wpm || 0} WPM | {userScore?.accuracy || 0}% Accuracy
            </p>
            <h1 className="text-[#A578FD] font-faster-one text-7xl mb-12 leading-tight">
              Your Score: {userScore?.score || 0}
            </h1>
          </div>

          {/* Giveaway Button */}
          <button className="bg-[#A578FD] text-white px-10 py-5 rounded-xl font-jost font-bold text-xl uppercase hover:bg-[#A578FD]/90 hover:shadow-lg hover:shadow-[#A578FD]/50 transition-all duration-300 transform hover:scale-105 mb-12 hover-pop">
            Participate in the Giveaway
          </button>

        </div>

        {/* Prize Pool */}
        <PrizePool />

        {/* Right Side - Leaderboard */}
        <div className={`flex-1 max-w-2xl transition-all duration-1000 transform ${isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '400ms' }}>
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl p-8 hover-pop">
            {/* Top 3 Podium */}
            <div className="flex justify-center items-end mb-12 gap-8">
              {/* 2nd Place */}
              <div className="text-center transform hover:scale-105 transition-transform">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 mb-3 mx-auto shadow-lg shadow-blue-500/50"></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-800">2</div>
                </div>
                <div className="text-cyan-400 font-bold text-lg mb-1">Ikarus1254</div>
                <div className="text-cyan-400 text-2xl font-bold">8200</div>
              </div>
              
              {/* 1st Place */}
              <div className="text-center relative transform hover:scale-105 transition-transform">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50">
                    <span className="text-yellow-900 text-xl">👑</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-b from-purple-400 to-purple-600 mb-3 mx-auto shadow-lg shadow-purple-500/50"></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-yellow-900">1</div>
                </div>
                <div className="text-white font-bold text-xl mb-1">Ikarus7654</div>
                <div className="text-purple-400 text-3xl font-bold">8456</div>
              </div>
              
              {/* 3rd Place */}
              <div className="text-center transform hover:scale-105 transition-transform">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-b from-green-400 to-green-600 mb-3 mx-auto shadow-lg shadow-green-500/50"></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-sm font-bold text-orange-900">3</div>
                </div>
                <div className="text-green-400 font-bold text-lg mb-1">Ikarus4483</div>
                <div className="text-green-400 text-2xl font-bold">7786</div>
              </div>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-2">
              {[
                { rank: 74, name: "Ikarus4567", score: 5600 },
                { rank: 75, name: "Ikarus8285", score: 5300 },
                { rank: 76, name: "Ikarus4875 (You)", score: userScore?.score || 5162, isUser: true },
                { rank: 77, name: "Ikarus9895", score: 4800 },
                { rank: 78, name: "Ikarus5684", score: 4600 },
                { rank: 79, name: "Ikarus3395", score: 4200 },
              ].map((player) => (
                <div 
                  key={player.rank} 
                  className={`flex items-center justify-between py-4 px-6 rounded-xl transition-all duration-300 hover:bg-gray-700/50 ${
                    player.isUser ? 'bg-[#A578FD]/20 border border-[#A578FD]/50 shadow-lg shadow-[#A578FD]/20' : 'bg-gray-800/30'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <span className="text-white/70 w-8 text-lg font-bold">{player.rank}</span>
                    <span className={`font-medium text-lg ${player.isUser ? 'text-[#A578FD]' : 'text-white'}`}>
                      {player.name}
                    </span>
                  </div>
                  <span className={`font-bold text-xl ${player.isUser ? 'text-[#A578FD]' : 'text-white'}`}>
                    {player.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`absolute bottom-8 left-8 transition-opacity duration-1000 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '600ms' }}>
        <h2 className="text-[#A578FD] font-faster-one text-5xl leading-tight tracking-wider">
          FASTEST
          <br />
          FINGERS
        </h2>
      </div>
    </main>
  );
}