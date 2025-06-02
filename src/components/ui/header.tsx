"use client"

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  currentPage?: 'home' | 'leaderboard' | 'giveaway' | 'contest';
  isPageLoaded?: boolean;
  className?: string;
}

export function Header({ currentPage, isPageLoaded = true, className = "" }: HeaderProps) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getButtonClass = (page: string) => {
    const baseClass = "font-jost text-sm sm:text-lg lg:text-xl transition-colors";
    if (currentPage === page) {
      return `${baseClass} text-[#A578FD]`;
    }
    return `${baseClass} text-white hover:text-[#A578FD]`;
  };

  const getMobileButtonClass = (page: string) => {
    const baseClass = "font-jost text-lg transition-colors py-3 px-8 text-left";
    if (currentPage === page) {
      return `${baseClass} text-[#A578FD]`;
    }
    return `${baseClass} text-white hover:text-[#A578FD]`;
  };

  return (
    <header className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 transition-opacity duration-800 flex-shrink-0 relative z-50 ${isPageLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}>
      {/* Logo and Desktop Navigation */}
      <div className="flex items-center gap-4 sm:gap-8 lg:gap-12">
        <Image
          src="/kreo.png"
          alt="KREO Logo"
          width={100}
          height={31}
          className="hover-pop sm:w-[120px] sm:h-[37px] lg:w-[142px] lg:h-[44px]"
        />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 sm:gap-8 lg:gap-12">
          <button 
            onClick={() => router.push('/homepage')}
            className={getButtonClass('home')}
          >
            Home
          </button>
          <button 
            onClick={() => router.push('/leaderboard')}
            className={getButtonClass('leaderboard')}
          >
            Leaderboard
          </button>
          <button 
            onClick={() => router.push('/score')}
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
          className="hidden md:block text-white font-jost text-sm sm:text-lg lg:text-xl hover:text-[#A578FD] transition-colors"
        >
          Log Out
        </button>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:text-[#A578FD] transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/20 md:hidden">
          <div className="flex flex-col py-4">
            <button 
              onClick={() => {
                router.push('/homepage')
                setIsMobileMenuOpen(false)
              }}
              className={getMobileButtonClass('home')}
            >
              Home
            </button>
            <button 
              onClick={() => {
                router.push('/leaderboard')
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
              className="text-white font-jost text-lg hover:text-[#A578FD] transition-colors py-3 px-8 text-left"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
} 