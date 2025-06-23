import { usePrizePool } from "@/hooks/use-prize-pool";
import { useAuth } from "@/components/auth-provider";

export function PrizePool() {
  const { user } = useAuth();
  const { totalPrizePool, formattedBreakdown, isLoading } = usePrizePool(user?.uid);

  return (
    <div className="relative max-w-52">
      <div className="relative border border-white/30 rounded-lg bg-black/20 backdrop-blur-sm">
        {/* Red Label */}
        <div className="absolute -top-3 right-3">
          <div className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">
            CURR PRIZE POOL
          </div>
        </div>

        {/* Content */}
        <div className="pt-6 pb-4 px-6">
          <div className="text-white font-bold text-[42px] leading-none mb-1">
            ₹{isLoading ? "10,000" : totalPrizePool.toLocaleString()}
          </div>
          <div className="text-white/50 text-xs">
            {isLoading ? "5000 + 20 × 250" : formattedBreakdown}
          </div>
        </div>
      </div>
    </div>
  );
} 