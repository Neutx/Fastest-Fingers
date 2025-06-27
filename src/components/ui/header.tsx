"use client"

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useState, useCallback, memo } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  currentPage?: 'home' | 'leaderboard' | 'giveaway' | 'contest';
  isPageLoaded?: boolean;
  className?: string;
}

function HeaderComponent({ currentPage, isPageLoaded = true, className = "" }: HeaderProps) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      router.push('/');
                } catch {
              // Error logging out
            }
  }, [signOut, router]);

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const getButtonClass = useCallback((page: string) => {
    const baseClass = "font-jost text-sm sm:text-lg lg:text-xl transition-colors duration-200 cursor-pointer";
    if (currentPage === page) {
      return `${baseClass} text-[#A578FD]`;
    }
    return `${baseClass} text-white hover:text-[#A578FD]`;
  }, [currentPage]);

  const getMobileButtonClass = useCallback((page: string) => {
    const baseClass = "font-jost text-lg transition-colors duration-200 py-3 px-8 text-left cursor-pointer";
    if (currentPage === page) {
      return `${baseClass} text-[#A578FD]`;
    }
    return `${baseClass} text-white hover:text-[#A578FD]`;
  }, [currentPage]);

  return (
    <header className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 flex-shrink-0 relative z-50 ${className}`} style={{ opacity: isPageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}>
      {/* Logo and Desktop Navigation */}
      <div className="flex items-center gap-4 sm:gap-8 lg:gap-12">
        <button 
          onClick={() => handleNavigation('/homepage')} 
          className="focus:outline-none transition-transform duration-200 hover:scale-105"
          aria-label="Go to homepage"
        >
          <Image
            src="/kreo.svg"
            alt="KREO Logo"
            width={100}
            height={31}
            className="sm:w-[120px] sm:h-[37px] lg:w-[142px] lg:h-[44px] cursor-pointer"
            priority
          />
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 sm:gap-8 lg:gap-12">
          <button 
            onClick={() => handleNavigation('/leaderboard')}
            className={getButtonClass('leaderboard')}
          >
            Leaderboard
          </button>
          <button 
            onClick={() => handleNavigation('/score')}
            className={getButtonClass('giveaway')}
          >
            Giveaway
          </button>
        </nav>
      </div>

      {/* Desktop Logout & Mobile Hamburger */}
      <div className="flex items-center">
        {/* Desktop Logout */}
        <button 
          onClick={handleLogout}
          className="hidden md:block text-white font-jost text-sm sm:text-lg lg:text-xl hover:text-[#A578FD] transition-colors duration-200 cursor-pointer"
        >
          Log Out
        </button>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:text-[#A578FD] transition-colors duration-200 cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/90 border-t border-white/20 md:hidden">
          <div className="flex flex-col py-4">
            <button 
              onClick={() => {
                handleNavigation('/leaderboard')
                setIsMobileMenuOpen(false)
              }}
              className={getMobileButtonClass('leaderboard')}
            >
              Leaderboard
            </button>
            <button 
              onClick={() => {
                handleLogout()
                setIsMobileMenuOpen(false)
              }}
              className="text-white font-jost text-lg hover:text-[#A578FD] transition-colors duration-200 py-3 px-8 text-left cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export const Header = memo(HeaderComponent); 