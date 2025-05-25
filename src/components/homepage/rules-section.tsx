"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

interface RuleCardProps {
  title: string
  description: string
  highlight: string
}

function RuleCard({ title, description, highlight }: RuleCardProps) {
  return (
    <div className="bg-black/40 backdrop-blur-sm border-[0.5px] border-white rounded-xl p-8 h-[280px] flex flex-col justify-center card-hover">
      <h3 className="text-[#A578FD] font-bold text-4xl md:text-5xl mb-6 font-jost">
        {highlight}
      </h3>
      <h4 className="text-white font-bold text-xl mb-3 font-jost">{title}</h4>
      <p className="text-white/90 text-base leading-relaxed font-jost">
        {description}
      </p>
    </div>
  )
}

export function RulesSection() {
  const { signInWithGoogle } = useAuth()
  
  const handleGetStarted = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in:", error);
    }
  }

  const handleExploreHive = () => {
    // TODO: Navigate to Hive 65 page
    console.log("Navigate to Hive 65")
  }

  return (
    <section 
      className="bg-black py-16 px-4"
      data-scroll-section
    >
      <div className="max-w-7xl mx-auto">
        {/* Rules Title */}
        <h2 
          className="text-white font-faster-one text-6xl md:text-7xl text-center mb-16 animate-fade-in-up opacity-0"
          data-scroll
          data-scroll-speed="0.2"
        >
          RULES
        </h2>

        {/* Rules Cards */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto"
          data-scroll
          data-scroll-speed="0.1"
        >
          <div className="animate-fade-in-up opacity-0 animate-delay-100">
            <RuleCard
              highlight="1 attempt"
              title=""
              description="One chance per account, make the most out of it."
            />
          </div>
          <div className="animate-fade-in-up opacity-0 animate-delay-200">
            <RuleCard
              highlight="24 hours"
              title=""
              description="The contest goes live on DD-MM-YY at HH:MM and will be live for 24 hours"
            />
          </div>
          <div className="animate-fade-in-up opacity-0 animate-delay-300">
            <RuleCard
              highlight="₹20"
              title=""
              description="Each entry adds ₹20 to the prize pool with a base of ₹5000"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          data-scroll
          data-scroll-speed="0.3"
        >
          <Button 
            variant="purple" 
            size="xl"
            onClick={handleGetStarted}
            className="w-[344px] font-degular-semibold button-hover animate-fade-in-up opacity-0 animate-delay-100"
          >
            Click to get started
          </Button>
          <Button 
            variant="white" 
            size="xl"
            onClick={handleExploreHive}
            className="w-[344px] font-degular-semibold button-hover animate-fade-in-up opacity-0 animate-delay-200"
          >
            eXPLORE hive 65
          </Button>
        </div>
      </div>
    </section>
  )
} 