import Image from "next/image";

export function DesktopOnly() {
  return (
    <main className="h-screen w-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/kreo.png"
            alt="KREO Logo"
            width={142}
            height={44}
            className="mx-auto"
          />
        </div>
        
        {/* Desktop Icon */}
        <div className="mb-6">
          <svg 
            className="w-16 h-16 mx-auto text-[#A578FD]" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/>
          </svg>
        </div>
        
        {/* Message */}
        <h1 className="text-white font-jost font-bold text-2xl mb-4">
          Desktop Only
        </h1>
        <p className="text-white/70 font-jost text-lg mb-6 leading-relaxed">
          This page is only accessible on desktop devices. Please visit us from a desktop or laptop computer to participate in the typing contest.
        </p>
        
        {/* Back Button */}
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-[#A578FD] text-white px-6 py-3 rounded-xl font-jost font-bold text-base hover:bg-[#A578FD]/90 hover:shadow-lg hover:shadow-[#A578FD]/50 transition-all duration-300 transform hover:scale-105"
        >
          Go Back to Home
        </button>
      </div>
    </main>
  );
} 