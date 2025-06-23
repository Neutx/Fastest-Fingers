export interface ContestSettings {
  startDate: string;
  startTime: string;
  duration: number; // in hours
  isActive: boolean;
  hive65Link?: string; // Link for Hive 65 product page
}

export type ContestStatus = 'not-started' | 'active' | 'ended'; 