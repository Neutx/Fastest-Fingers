import Image from "next/image";

export function LoadingAnimation() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      {/* KREO Logo with pulse animation */}
      <div className="mb-8 animate-pulse">
        <Image
          src="/kreo.png"
          alt="KREO Logo"
          width={200}
          height={62}
          className="mx-auto"
        />
      </div>

      {/* FASTEST FINGERS text with fade animation */}
      <div className="mb-8">
        <h1 className="text-[#A578FD] font-faster-one text-4xl text-center animate-pulse">
          FASTEST FINGERS
        </h1>
      </div>

      {/* Custom typing dots animation */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-3 h-3 bg-[#A578FD] rounded-full animate-bounce [animation-delay:0ms]"></div>
        <div className="w-3 h-3 bg-[#A578FD] rounded-full animate-bounce [animation-delay:150ms]"></div>
        <div className="w-3 h-3 bg-[#A578FD] rounded-full animate-bounce [animation-delay:300ms]"></div>
      </div>

      {/* Loading text with typewriter effect */}
      <div className="text-white font-jost text-lg mb-8">
        <span className="inline-block">Loading your typing experience</span>
        <span className="animate-typing-cursor">|</span>
      </div>

      {/* Keyboard-inspired loading bar */}
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#A578FD] to-purple-400 rounded-full animate-loading-bar"></div>
      </div>
    </div>
  );
} 