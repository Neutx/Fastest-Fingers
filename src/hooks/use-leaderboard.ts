import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAnimationObserver } from "@/hooks/use-animation-observer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserScore {
  wpm: number;
  accuracy: number;
  score: number;
}

interface LeaderboardPlayer {
  rank: number;
  name: string;
  score: number;
  avatar?: string;
  isUser?: boolean;
}

export function useLeaderboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

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

  // Mock leaderboard data - replace with real data from your backend
  const leaderboardPlayers: LeaderboardPlayer[] = [
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

  return {
    user,
    loading,
    userScore,
    isPageLoaded,
    leaderboardPlayers
  };
} 