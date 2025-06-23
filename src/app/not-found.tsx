"use client"

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen w-full bg-black relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A578FD]/20 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#A578FD]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#A578FD]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <Image
            src="/kreo.png"
            alt="KREO Logo"
            width={200}
            height={62}
            className="mx-auto"
            priority
          />
        </div>

        {/* 404 Title */}
        <div className="mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <h1 className="text-[#A578FD] font-faster-one text-8xl sm:text-9xl lg:text-[120px] leading-none mb-4">
            404
          </h1>
          <h2 className="text-white font-jost text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-white/70 font-jost text-lg sm:text-xl lg:text-2xl max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to the typing challenge!
          </p>
        </div>

        {/* Home Button */}
        <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <button
            onClick={handleGoHome}
            className="bg-[#A578FD] text-white px-8 py-4 rounded-xl font-jost font-bold text-lg uppercase hover:bg-[#A578FD]/90 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#A578FD]/50"
          >
            Back to Home
          </button>
        </div>

        {/* Additional Message */}
        <div className="mt-12 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <p className="text-white/50 font-jost text-sm">
            Ready to test your typing speed? Click the button above to start your fastest fingers challenge!
          </p>
        </div>
      </div>

      
    </main>
  );
} 