"use client"

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CardTier, CardSettings } from "@/types/contest";

const defaultCardTiers: CardTier[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    wpmRange: '< 2.5K',
    description: 'You are probably\nstill using dial up connection',
    bgGradient: 'bg-violet-400',
    imageUrl: '/cards/beginner-card.png',
    minWpm: 0,
    maxWpm: 2499,
    order: 1
  },
  {
    id: 'casual',
    name: 'Casual',
    wpmRange: '2.5K - 5K',
    description: 'Are you the sum of all numbers divided by how many there are? Because you\'re average.',
    bgGradient: 'bg-violet-400',
    imageUrl: '/cards/casual-card.png',
    minWpm: 2500,
    maxWpm: 4999,
    order: 2
  },
  {
    id: 'pro',
    name: 'Pro',
    wpmRange: '5K - 8K',
    description: 'You\'re the fastest!\n(in your friend circle)',
    bgGradient: 'bg-violet-400',
    imageUrl: '/cards/pro-card.png',
    minWpm: 5000,
    maxWpm: 7999,
    order: 3
  },
  {
    id: 'elite',
    name: 'Elite',
    wpmRange: '8K - 10K',
    description: 'It\'s not your fault. Repeat\nafter us. It\'s not your fault',
    bgGradient: 'bg-violet-400',
    imageUrl: '/cards/elite-card.png',
    minWpm: 8000,
    maxWpm: 9999,
    order: 4
  },
  {
    id: 'godlike',
    name: 'Godlike',
    wpmRange: '10K+',
    description: 'O Dear Lord! Please\nBless us all',
    bgGradient: 'bg-violet-400',
    imageUrl: '/cards/godlike-card.png',
    minWpm: 10000,
    maxWpm: Infinity,
    order: 5
  }
];

export function useCardSettings() {
  const [cardTiers, setCardTiers] = useState<CardTier[]>(defaultCardTiers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCardSettings = async () => {
      try {
        const cardRef = doc(db, 'admin', 'cardSettings');
        const cardSnap = await getDoc(cardRef);
        
        if (cardSnap.exists()) {
          const data = cardSnap.data() as CardSettings;
          // Sort by order
          const sortedTiers = [...data.tiers].sort((a, b) => a.order - b.order);
          setCardTiers(sortedTiers);
        }
      } catch {
        // Error fetching card settings, use defaults
      } finally {
        setLoading(false);
      }
    };

    fetchCardSettings();
  }, []);

  const getCardTier = (score: number): CardTier => {
    const tier = cardTiers.find(tier => score >= tier.minWpm && score <= tier.maxWpm);
    return tier || cardTiers[0]; // Default to first tier
  };

  return {
    cardTiers,
    getCardTier,
    loading
  };
} 