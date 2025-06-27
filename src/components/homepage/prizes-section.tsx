"use client"

import { useContestSettings } from "@/hooks/use-contest-settings"

interface PrizeCardProps {
  title: string
  description: string
  note?: string
}

function PrizeCard({ title, description, note }: PrizeCardProps) {
  const { hive65Link } = useContestSettings();
  
  // Split title to handle "aka" parts with different fonts
  const titleParts = title.split(/(aka [^"]*)/);

  
  // Function to make Hive 65 clickable in description
  const renderDescription = (text: string) => {
    if (!text.includes('Hive 65')) {
      return text;
    }
    
    const parts = text.split(/(Hive 65)/);
    return parts.map((part, index) => {
      if (part === 'Hive 65' && hive65Link) {
        return (
          <a 
            key={index}
            href={hive65Link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#A578FD] hover:text-[#A578FD]/80 underline transition-colors cursor-pointer"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };
  
  return (
    <div className="bg-white/40 backdrop-blur-sm border border-gray-400 rounded-xl p-8 shadow-lg card-hover">
      <h3 className="text-black font-bold text-2xl md:text-3xl mb-4">
        {titleParts.map((part, index) => (
          <span 
            key={index} 
            className={part.startsWith('aka ') ? 'font-jost font-normal' : 'font-jost font-bold'}
          >
            {part}
          </span>
        ))}
      </h3>
      <div className="inline-block">
        <p className="text-black text-base leading-relaxed font-jost">
          {renderDescription(description)}
        </p>
        {note && (
          <p className="text-black text-[7px] text-right mt-0.5 font-jost">
            {note}
          </p>
        )}
      </div>
    </div>
  )
}

export function PrizesSection() {

  return (
    <section 
      className="bg-white py-16 px-4"
      data-scroll-section
    >
      <div className="max-w-7xl mx-auto">
        {/* Prizes Title */}
        <h2 
          className="text-black font-faster-one text-6xl md:text-7xl text-center mb-16 animate-fade-in-up opacity-0"
          data-scroll
          data-scroll-speed="0.2"
        >
          PRIZES
        </h2>

        {/* Prize Cards */}
        <div 
          className="space-y-6 mb-12 max-w-4xl mx-auto"
          data-scroll
          data-scroll-speed="0.1"
        >
          <div className="animate-fade-in-up opacity-0 animate-delay-100">
            <PrizeCard
              title="#The Winner aka the fastest typer"
              description="Wins the entire prize pool amount set at a base of ₹5,000 and increases by ₹5 with every new participation*"
              note="Capped at a maximum pool of ₹11000"
            />
          </div>
          <div className="animate-fade-in-up opacity-0 animate-delay-200">
            <PrizeCard
              title="#The other winner aka the lucky bastard"
              description="Wins the all new Kreo Hive 65 by participating in the giveaway at the end of the typing challenge. Life's unfair."
            />
          </div>
          <div className="animate-fade-in-up opacity-0 animate-delay-300">
            <PrizeCard
              title="#Everyone Else"
              description="will get a custom card based on your typing score that defines their personality"
            />
          </div>
        </div>


      </div>
    </section>
  )
} 