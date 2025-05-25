"use client"

export function DashboardPrizePool() {
  return (
    <section 
      className="bg-black py-16 px-4 flex justify-center items-center"
      data-scroll-section
    >
      <div 
        className="relative border-2 border-white/50 rounded-2xl bg-black/60 backdrop-blur-sm hover-pop animate-fade-in-up opacity-0"
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
            ₹10,000
          </div>
          <div className="text-white/60 text-xl text-center">
            5000 + 20 × 250
          </div>
        </div>
      </div>
    </section>
  )
} 