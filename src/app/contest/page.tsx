"use client"

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "@/components/ui/loading";
import { RulesModal } from "@/components/ui/rules-modal";
import { DesktopOnly } from "@/components/ui/desktop-only";

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

  const [sampleText, setSampleText] = useState(() => generateTypingText(60));
  
  const {
    timeLeft,
    wpm,
    accuracy,
    isTestCompleted,
    handleKeyPress,
    getDisplayText,
    currentWordIndex
  } = useTypingTest(sampleText, 30);

  // Load more words when user gets near the end
  useEffect(() => {
    const words = sampleText.split(' ');
    if (currentWordIndex >= words.length - 15) {
      setSampleText(prev => prev + ' ' + generateTypingText(30));
    }
  }, [currentWordIndex, sampleText]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
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
        } catch {
          // Error checking test status
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
        } catch {
          // Error saving test results
        }
      }
    };

    saveTestResults();
  }, [isTestCompleted, user, wpm, accuracy, hasCompletedTest, router]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showRules) return;
      
      if (
        event.key === 'Control' ||
        event.key === 'Shift' ||
        event.key === 'Tab' ||
        event.key === 'Alt' ||
        event.key === 'Meta' ||
        event.key === 'CapsLock' ||
        event.key === 'Escape' ||
        event.key === 'F1' || event.key === 'F2' || event.key === 'F3' || event.key === 'F4' ||
        event.key === 'F5' || event.key === 'F6' || event.key === 'F7' || event.key === 'F8' ||
        event.key === 'F9' || event.key === 'F10' || event.key === 'F11' || event.key === 'F12' ||
        event.key === 'Insert' ||
        event.key === 'Delete' ||
        event.key === 'Home' ||
        event.key === 'End' ||
        event.key === 'PageUp' ||
        event.key === 'PageDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight'
      ) {
        return;
      }
      
      event.preventDefault();
      handleKeyPress(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, showRules]);

  // Only show loading if we're still checking test status (not for auth)
  if (isCheckingTestStatus) {
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
    <main className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Custom Header for Contest Page */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 flex-shrink-0">
        <div className="flex items-center gap-4 sm:gap-8">
          <button 
            onClick={() => router.push('/homepage')} 
            className="focus:outline-none transition-transform duration-200 hover:scale-105"
            aria-label="Go to homepage"
          >
          <Image
            src="/kreo.png"
            alt="KREO Logo"
            width={120}
            height={37}
              className="sm:w-[142px] sm:h-[44px] cursor-pointer"
              priority
          />
          </button>
          <nav className="flex items-center gap-4 sm:gap-8">
            <button 
              onClick={() => router.push('/leaderboard')}
              className="text-white font-jost text-sm sm:text-xl hover:text-[#A578FD] transition-colors duration-200 cursor-pointer"
            >
              Leaderboard
            </button>
            <button 
              onClick={() => router.push('/score')}
              className="text-white font-jost text-sm sm:text-xl hover:text-[#A578FD] transition-colors duration-200 cursor-pointer"
            >
              Giveaway
            </button>
            <button 
              onClick={() => setShowRules(true)}
              className="text-white font-jost text-sm sm:text-xl hover:text-[#A578FD] transition-colors duration-200 focus:outline-none cursor-pointer"
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
            } catch {
              // Error logging out
            }
          }}
          className="text-white font-jost text-sm sm:text-xl hover:text-[#A578FD] transition-colors duration-200 cursor-pointer"
        >
          Log Out
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 flex-1 min-h-0">
        {/* Title */}
        <h1 className="text-[#A578FD] font-faster-one text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-3 sm:mb-4 lg:mb-6">
          FASTEST
          <br />
          FINGERS
        </h1>

        {/* Instructions */}
        <p className="text-white font-jost font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center mb-6 sm:mb-8 lg:mb-12 max-w-4xl">
          Start typing to begin. 30 seconds. Go!
        </p>

        {/* Timer Circle */}
        <div className="relative mb-8 sm:mb-12 lg:mb-16">
          <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] lg:w-[167px] lg:h-[167px] rounded-full border-[15px] sm:border-[17px] lg:border-[19px] border-[#A578FD] flex items-center justify-center transition-transform duration-200 hover:scale-105">
            <span className="text-white font-jost font-bold text-3xl sm:text-4xl lg:text-5xl">
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Typing Area */}
        <div className="max-w-6xl w-full text-center flex-1 min-h-0 flex flex-col">
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-8 sm:leading-10 md:leading-12 lg:leading-[60px] mb-4 sm:mb-6 lg:mb-8 font-mono flex-1 flex flex-col justify-center min-h-0">
            {(() => {
              const allWords = getDisplayText();
              
              const wordsPerLine = 9; // Fixed words per line to prevent text wrapping
              const currentLineIndex = Math.floor(currentWordIndex / wordsPerLine);

              const linesToShow = 3;
              const firstLineIndex = Math.max(0, currentLineIndex - 1);
              
              const lines = [];
              for (let i = 0; i < linesToShow; i++) {
                const lineIndex = firstLineIndex + i;
                const lineWords = allWords.slice(lineIndex * wordsPerLine, (lineIndex + 1) * wordsPerLine);
                
                if (lineWords.length === 0) continue;
                
                lines.push(
                  <div key={lineIndex} className="mb-1 sm:mb-2 min-h-[1.5em] whitespace-nowrap overflow-hidden">
                    {lineWords.map((wordData) => (
                      <span key={wordData.wordIndex} className="mr-2 sm:mr-3 inline-block">
                        {wordData.characters ? (
                          wordData.characters.map((charData, charIndex) => (
                            <span
                              key={`${wordData.wordIndex}-${charIndex}`}
                              className={`inline-block relative ${
                                charData.status === 'correct' ? 'text-white' :
                                charData.status === 'error' ? 'text-red-400' :
                                'text-white/30'
                              }`}
                              style={{ minWidth: '0.5ch' }}
                            >
                              {charData.status === 'current' && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-3/4 w-[2px] bg-[#A578FD] animate-pulse z-10"></span>
                              )}
                              {charData.char}
                            </span>
                          ))
                        ) : (
                          // Fallback for word-level status if needed
                          <span
                            className={`${
                              wordData.status === 'completed' ? 'text-white' :
                              'text-white/30'
                            }`}
                          >
                            {wordData.word}
                          </span>
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
          <div className="text-center mt-4">
            <p className="text-white font-jost text-lg sm:text-xl">
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