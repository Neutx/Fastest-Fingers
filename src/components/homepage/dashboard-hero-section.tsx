"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { ChevronDown, Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function DashboardHeroSection() {
  const { signOut } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
          } catch {
        // Error signing out
      }
  }


  return (
    <section 
      className="relative h-screen bg-black flex flex-col text-center px-4 overflow-hidden"
      data-scroll-section
    >
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 z-0 parallax-slow"
        data-scroll
        data-scroll-speed="-0.5"
      >
        <Image
          src="/homepage/hive68-img.svg"
          alt="Gaming keyboard background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Custom Navbar Overlay */}
      <nav className="relative z-30 flex items-center justify-between px-8 py-6">
        {/* Logo */}
        <button 
          onClick={() => router.push('/homepage')} 
          className="focus:outline-none"
          aria-label="Go to homepage"
        >
          <Image
            src="/kreo.png"
            alt="KREO Logo"
            width={142}
            height={44}
            className="cursor-pointer"
          />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          <button 
            onClick={() => router.push('/leaderboard')}
            className="text-white font-jost text-xl hover:text-[#A578FD] transition-colors cursor-pointer"
          >
            Leaderboard
          </button>
          <button 
            onClick={() => router.push('/score')}
            className="text-white font-jost text-xl hover:text-[#A578FD] transition-colors cursor-pointer"
          >
            Giveaway
          </button>
          <button 
            onClick={handleLogout}
            className="text-white font-jost text-xl hover:text-[#A578FD] transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:text-[#A578FD] transition-colors cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/20 md:hidden">
            <div className="flex flex-col py-4">
              <button 
                onClick={() => {
                  router.push('/leaderboard')
                  setIsMobileMenuOpen(false)
                }}
                className="text-white font-jost text-lg hover:text-[#A578FD] transition-colors py-3 px-8 text-left cursor-pointer"
              >
                Leaderboard
              </button>
              <button 
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="text-white font-jost text-lg hover:text-[#A578FD] transition-colors py-3 px-8 text-left cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </nav>
      
      {/* Content positioned above keyboard */}
      <div className="relative z-20 flex flex-col items-center pt-4 pb-4 flex-1 justify-start">
        {/* Main Title with parallax - Moved Up */}
        <h1 
          className="text-[#A578FD] font-faster-one text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-[90px] leading-[0.8] mb-4 md:mb-6 lg:mb-8 mt-4 md:mt-6 lg:mt-8 animate-fade-in-up opacity-0 animate-delay-100"
          data-scroll
          data-scroll-speed="0.3"
        >
          FASTEST
          <br />
          FINGERS
        </h1>

        {/* Subtitle with animation - Moved Up */}
        <p 
          className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-[28px] font-degular-thin mb-6 md:mb-8 lg:mb-12 max-w-2xl animate-fade-in-up opacity-0 animate-delay-200"
          data-scroll
          data-scroll-speed="0.1"
        >
          Ready for the ultimate typing challenge?
        </p>

        {/* Spacer to push buttons down but not too much */}
        <div className="flex-1 min-h-[40px] md:min-h-[60px] lg:min-h-[60px]"></div>

        {/* Two CTA Buttons - Positioned to avoid overlap */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-16 md:mb-20 lg:mb-24">
          <Button 
            variant="purple" 
            size="lg-button"
            onClick={() => router.push('/contest')}
            className="w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] font-degular-semibold button-hover animate-fade-in-up opacity-0 animate-delay-300"
            data-scroll
            data-scroll-speed="0.2"
          >
            Participate in Giveaway
          </Button>
          
          <Button 
            variant="white" 
            size="lg-button"
            onClick={() => router.push('/leaderboard')}
            className="w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] font-degular-semibold button-hover animate-fade-in-up opacity-0 animate-delay-400"
            data-scroll
            data-scroll-speed="0.2"
          >
            Check Leaderboard
          </Button>
        </div>
      </div>

      {/* Animated Scroll Arrow with parallax */}
      <div 
        className="absolute bottom-8 md:bottom-12 lg:bottom-4 left-1/2 transform -translate-x-1/2 z-20 animate-scroll-arrow"
        data-scroll
        data-scroll-speed="0.4"
      >
        <div className="flex flex-col items-center">
          <div className="text-white/60 text-xs sm:text-sm font-jost mb-1 md:mb-2">Scroll Down</div>
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/70" />
          <ChevronDown className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white/50 -mt-2 md:-mt-3" />
        </div>
      </div>
    </section>
  )
} 