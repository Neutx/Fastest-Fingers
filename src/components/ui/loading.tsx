import Image from "next/image";

export function LoadingAnimation() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      {/* KREO Logo - static, no animation */}
      <div className="mb-8">
        <Image
          src="/kreo.svg"
          alt="KREO Logo"
          width={200}
          height={62}
          className="mx-auto"
        />
      </div>

      {/* FASTEST FINGERS text - static */}
      <div className="mb-8">
        <h1 className="text-[#A578FD] font-faster-one text-4xl text-center">
          FASTEST FINGERS
        </h1>
      </div>

      {/* Simple 3 dots animation - only this animates */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-3 h-3 bg-[#A578FD] rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-[#A578FD] rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-3 h-3 bg-[#A578FD] rounded-full animate-pulse [animation-delay:0.4s]"></div>
      </div>

      {/* Simple loading text - static */}
      <div className="text-white font-jost text-lg">
        Loading your typing experience
      </div>
    </div>
  );
} 