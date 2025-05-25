export function PrizePool() {
  return (
    <div className="absolute right-0 top-1/2 transform translate-x-[-335%] -translate-y-[-110%] z-0">
      <div className="relative border border-white/30 rounded-lg bg-black/20 backdrop-blur-sm hover-pop">
        {/* Red Label */}
        <div className="absolute -top-3 right-4">
          <div className="bg-red-600 text-white px-4 py-1 rounded text-xs font-bold uppercase tracking-wide">
            CURR PRIZE POOL
          </div>
        </div>

        {/* Content */}
        <div className="pt-6 pb-4 px-6">
          <div className="text-white font-bold text-[42px] leading-none mb-1">
            ₹10,000
          </div>
          <div className="text-white/50 text-sm">
            5000 + 20 × 250
          </div>
        </div>
      </div>
    </div>
  );
} 