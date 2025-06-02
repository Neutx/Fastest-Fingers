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
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }


  return (
    <section 
      className="relative min-h-screen bg-black flex flex-col text-center px-4"
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
            onClick={() => router.push('/score')}
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
      </nav>
      
      {/* Content positioned above keyboard */}
      <div className="relative z-20 flex flex-col items-center pt-8 pb-8 flex-1 justify-center">
        {/* Main Title with parallax */}
        <h1 
          className="text-[#A578FD] font-faster-one text-6xl md:text-8xl lg:text-[112px] leading-[0.8] mb-8 animate-fade-in-up opacity-0 animate-delay-100"
          data-scroll
          data-scroll-speed="0.3"
        >
          FASTEST
          <br />
          FINGERS
        </h1>

        {/* Subtitle with animation */}
        <p 
          className="text-white text-lg md:text-2xl lg:text-[34px] font-degular-thin mb-90 max-w-2xl animate-fade-in-up opacity-0 animate-delay-200"
          data-scroll
          data-scroll-speed="0.1"
        >
          Ready for the ultimate typing challenge?
        </p>

        {/* Two CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-11">
          <Button 
            variant="purple" 
            size="xl"
            onClick={() => router.push('/contest')}
            className="w-[344px] font-degular-semibold button-hover animate-fade-in-up opacity-0 animate-delay-300"
            data-scroll
            data-scroll-speed="0.2"
          >
            Participate in Giveaway
          </Button>
          
          <Button 
            variant="white" 
            size="xl"
            onClick={() => router.push('/leaderboard')}
            className="w-[344px] font-degular-semibold button-hover animate-fade-in-up opacity-0 animate-delay-400"
            data-scroll
            data-scroll-speed="0.2"
          >
            Check Leaderboard
          </Button>
        </div>
      </div>

      {/* Animated Scroll Arrow with parallax */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-scroll-arrow"
        data-scroll
        data-scroll-speed="0.4"
      >
        <div className="flex flex-col items-center hover-pop cursor-pointer">
          <div className="text-white/60 text-sm font-jost mb-2">Scroll Down</div>
          <ChevronDown className="w-6 h-6 text-white/70" />
          <ChevronDown className="w-4 h-4 text-white/50 -mt-3" />
        </div>
      </div>
    </section>
  )
} 