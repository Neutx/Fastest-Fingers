export interface ContestSettings {
  startDate: string;
  startTime: string;
  duration: number; // in hours
  isActive: boolean;
  hive65Link?: string; // Link for Hive 65 product page
  tweetLink?: string; // Link for X (Twitter) post
}

export interface CardTier {
  id: string;
  name: string;
  wpmRange: string;
  description: string;
  bgGradient: string;
  imageUrl: string;
  minWpm: number;
  maxWpm: number;
  order: number;
}

export interface CardSettings {
  tiers: CardTier[];
  lastUpdated: string;
}

export type ContestStatus = 'not-started' | 'active' | 'ended'; 