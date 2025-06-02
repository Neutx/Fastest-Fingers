"use client"

interface PrizeCardProps {
  title: string
  description: string
}

function PrizeCard({ title, description }: PrizeCardProps) {
  // Split title to handle "aka" parts with different fonts
  const titleParts = title.split(/(aka [^"]*)/);
  
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
      <p className="text-black text-base leading-relaxed font-jost">
        {description}
      </p>
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
              description="Wins the entire prize pool amount set at a base of ₹5,000 and increases by ₹20 with every new participation"
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