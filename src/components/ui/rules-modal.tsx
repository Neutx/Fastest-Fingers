"use client"

import { useEffect } from "react";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  showAutomatically?: boolean;
}

export function RulesModal({ isOpen, onClose, showAutomatically = false }: RulesModalProps) {
  // Auto-show modal when component mounts if showAutomatically is true
  useEffect(() => {
    if (showAutomatically) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        // Modal will show because isOpen will be true from parent
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showAutomatically]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-up">
      <div className="bg-[#F0F0F0] rounded-[55px] p-12 max-w-2xl w-full shadow-2xl card-hover">
        <h2 className="text-[#A578FD] font-faster-one text-4xl text-center mb-8">
          BEFORE YOU START
        </h2>
        
        <div className="space-y-4 mb-8">
          <h3 className="text-black font-jost font-bold text-xl mb-4">Rules:</h3>
          <div className="text-black font-jost space-y-3 list-decimal list-inside text-base leading-relaxed">
            1. The timer will start as soon as you hit any keystroke on your keyboard<br/>
            2. The final score is decided as a multiple of speed and accuracy<br/>
            3. You only get one chance<br/>
            4. Top scorer wins the entire prize pool<br/>
            5. Another lucky winner from giveaway will also win Hive 65<br/>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-[#A578FD] text-white px-8 py-3 rounded-lg font-degular-semibold uppercase hover:bg-[#A578FD]/90 transition-colors button-hover focus:outline-none"
          >
            ALRIGHT! LET&apos;S GO!
          </button>
        </div>
      </div>
    </div>
  );
} 