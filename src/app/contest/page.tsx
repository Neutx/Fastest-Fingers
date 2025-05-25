"use client"

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "@/components/ui/loading";
import { RulesModal } from "@/components/ui/rules-modal";
import { DesktopOnly } from "@/components/ui/desktop-only";
import { useAnimationObserver } from "@/hooks/use-animation-observer";
import { useTypingTest } from "@/hooks/use-typing-test";
import { generateTypingText } from "@/lib/text-generator";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isMobileDevice } from "@/utils/device-detection";
import Image from "next/image";

export default function ContestPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [showRules, setShowRules] = useState(true); // Show rules by default
  const [hasShownInitialRules, setHasShownInitialRules] = useState(false);
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [isCheckingTestStatus, setIsCheckingTestStatus] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [sampleText] = useState(() => generateTypingText(30));
  
  const {
    timeLeft,
    wpm,
    accuracy,
    isTestCompleted,
    handleKeyPress,
    getDisplayText
  } = useTypingTest(sampleText, 30);

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

  // Auto-show rules when user first loads the page
  useEffect(() => {
    if (user && !hasShownInitialRules) {
      setShowRules(true);
      setHasShownInitialRules(true);
    }
  }, [user, hasShownInitialRules]);

  const handleCloseRules = () => {
    setShowRules(false);
  };

  // Check if user has already completed the test
  useEffect(() => {
    const checkTestStatus = async () => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.hasCompletedTest) {
              // User has already completed the test, redirect to score page
              router.push('/score');
              return;
            }
          }
          setIsCheckingTestStatus(false);
        } catch (error) {
          console.error('Error checking test status:', error);
          setIsCheckingTestStatus(false);
        }
      }
    };

    checkTestStatus();
  }, [user, router]);

  // Save test results when completed
  useEffect(() => {
    const saveTestResults = async () => {
      if (isTestCompleted && user && !hasCompletedTest) {
        try {
          const score = Math.round((wpm * accuracy) / 100 * 100); // Calculate score
          const userRef = doc(db, 'users', user.uid);
          
          await setDoc(userRef, {
            hasCompletedTest: true,
            // Store test result as a single object instead of array
            testResult: {
              wpm,
              accuracy,
              score
            },
            bestScore: score,
            completedAt: serverTimestamp(),
            lastTestAt: serverTimestamp()
          }, { merge: true });

          setHasCompletedTest(true);
          
          // Redirect to score page after a short delay
          setTimeout(() => {
            router.push('/score');
          }, 2000);
        } catch (error) {
          console.error('Error saving test results:', error);
        }
      }
    };

    saveTestResults();
  }, [isTestCompleted, user, wpm, accuracy, hasCompletedTest, router]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showRules) return; // Don't handle input when rules modal is open
      
      event.preventDefault();
      handleKeyPress(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, showRules]);

  // Show loading while checking auth or test status
  if (loading || isCheckingTestStatus) {
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
    <main className="min-h-screen bg-black relative flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 animate-fade-in-up opacity-0 absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center gap-8">
          <Image
            src="/kreo.png"
            alt="KREO Logo"
            width={142}
            height={44}
            className="hover-pop"
          />
          <nav className="flex items-center gap-8">
            <button 
              onClick={() => router.push('/contest')}
              className="text-[#A578FD] font-jost text-xl"
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
              onClick={() => setShowRules(true)}
              className="text-white font-jost text-xl hover:text-[#A578FD] transition-colors focus:outline-none"
            >
              Rules
            </button>
          </nav>
        </div>
        <button 
          onClick={async () => {
            try {
              await signOut();
              router.push('/');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          }}
          className="text-white font-jost text-xl hover:text-[#A578FD] transition-colors"
        >
          Log Out
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 flex-1 min-h-screen">
        {/* Title */}
        <h1 className="text-[#A578FD] font-faster-one text-5xl md:text-6xl text-center mb-8 animate-fade-in-up opacity-0 animate-delay-100">
          FASTEST
          <br />
          FINGERS
        </h1>

        {/* Instructions */}
        <p className="text-white font-jost font-bold text-2xl md:text-4xl text-center mb-16 max-w-4xl animate-fade-in-up opacity-0 animate-delay-200">
          Start typing to begin. 30 seconds. Go!
        </p>

        {/* Timer Circle */}
        <div className="relative mb-16 animate-fade-in-up opacity-0 animate-delay-300">
          <div className="w-[167px] h-[167px] rounded-full border-[19px] border-[#A578FD] flex items-center justify-center hover-pop">
            <span className="text-white font-jost font-bold text-5xl">
              {timeLeft}
            </span>
          </div>
        </div>



        {/* Typing Area */}
        <div className="max-w-5xl w-full text-center animate-fade-in-up opacity-0 animate-delay-300">
          <div className="text-2xl md:text-3xl leading-[60px] mb-8 font-mono h-[180px] flex flex-col justify-center">
            {(() => {
              const words = getDisplayText();
              const wordsPerLine = Math.ceil(words.length / 3);
              const lines = [];
              
              for (let i = 0; i < 3; i++) {
                const lineWords = words.slice(i * wordsPerLine, (i + 1) * wordsPerLine);
                lines.push(
                  <div key={i} className="mb-2">
                    {lineWords.map((wordData, index) => (
                      <span key={i * wordsPerLine + index} className="mr-3">
                        {wordData.characters ? (
                          // Render character by character
                          wordData.characters.map((charData, charIndex) => (
                            <span
                              key={charIndex}
                              className={`${
                                charData.status === 'correct' ? 'text-white' :
                                charData.status === 'error' ? 'text-red-400' :
                                charData.status === 'current' ? 'text-[#A578FD] bg-[#A578FD]/20' :
                                'text-white/30'
                              }`}
                            >
                              {charData.char}
                            </span>
                          ))
                        ) : (
                          // Fallback for words without character data
                          <span className="text-white/30">{wordData.word}</span>
                        )}
                      </span>
                    ))}
                  </div>
                );
              }
              
              return lines;
            })()}
          </div>
        </div>

        {/* Test Completion Message */}
        {isTestCompleted && (
          <div className="text-center mt-8">
            <h2 className="text-[#A578FD] font-faster-one text-4xl mb-4">
              Test Completed!
            </h2>
            <p className="text-white font-jost text-xl">
              Redirecting to your score page...
            </p>
          </div>
        )}
      </div>

      {/* Rules Modal */}
      <RulesModal 
        isOpen={showRules} 
        onClose={handleCloseRules}
        showAutomatically={!hasShownInitialRules}
      />
    </main>
  );
} 