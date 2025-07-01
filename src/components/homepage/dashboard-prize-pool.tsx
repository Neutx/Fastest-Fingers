"use client"

import { usePrizePool } from "@/hooks/use-prize-pool";
import { useAuth } from "@/components/auth-provider";

export function DashboardPrizePool() {
  const { user } = useAuth();
  const { totalPrizePool, formattedBreakdown, isLoading } = usePrizePool(user?.uid);

  return (
    <section 
      className="bg-black py-16 px-4 flex flex-col justify-center items-center"
      data-scroll-section
    >
      <div 
        className="relative border-2 border-white/50 rounded-2xl bg-black/60 backdrop-blur-sm animate-fade-in-up opacity-0"
        data-scroll
        data-scroll-speed="0.2"
      >
        {/* Red Label */}
        <div className="absolute -top-4 right-8">
          <div className="bg-red-600 text-white px-8 py-2 rounded-lg text-lg font-bold uppercase tracking-wide">
            CURR PRIZE POOL
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 pb-8 px-12">
          <div className="text-white font-bold text-[72px] leading-none mb-3 text-center">
            ₹{isLoading ? "11,000" : totalPrizePool.toLocaleString()}
          </div>
          <div className="text-white/60 text-xl text-center">
            {isLoading ? "5000 + 5 × 1200 (capped at 11000)" : formattedBreakdown}
          </div>
        </div>
      </div>

      {/* Footnote */}
      <p className="text-white/60 text-xs text-center mt-4">
        * Capped at a maximum pool of ₹11000
      </p>
    </section>
  )
} 