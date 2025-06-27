"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  const { signInWithGoogle } = useAuth()
  const handleGetStarted = async () => {
    try {
      await signInWithGoogle();
    } catch {
      // Error signing in
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
      
      {/* Content positioned above keyboard */}
      <div className="relative z-20 flex flex-col items-center pt-16 pb-8">
        {/* KREO Logo with fade in animation */}
        <div 
          className="mb-12 animate-fade-in-up opacity-0"
          data-scroll
          data-scroll-speed="0.2"
        >
          <Image
            src="/kreo.svg"
            alt="KREO Logo"
            width={200}
            height={62}
            className="mx-auto"
          />
        </div>

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
          className="text-white text-lg md:text-2xl lg:text-[34px] font-degular-thin mb-100 max-w-2xl animate-fade-in-up opacity-0 animate-delay-200"
          data-scroll
          data-scroll-speed="0.1"
        >
          Can you type faster than everyone else?
        </p>

        {/* CTA Button with hover animation */}
        <Button 
          variant="purple" 
          size="lg-button"
          onClick={handleGetStarted}
          className="w-[320px] font-degular-semibold mb-16 button-hover animate-fade-in-up opacity-0 animate-delay-300"
          data-scroll
          data-scroll-speed="0.2"
        >
          Click to get started
        </Button>
      </div>

      {/* Animated Scroll Arrow with parallax */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-scroll-arrow"
        data-scroll
        data-scroll-speed="0.4"
      >
        <div className="flex flex-col items-center">
          <div className="text-white/60 text-sm font-jost mb-2">Scroll Down</div>
          <ChevronDown className="w-6 h-6 text-white/70" />
          <ChevronDown className="w-4 h-4 text-white/50 -mt-3" />
        </div>
      </div>
    </section>
  )
} 