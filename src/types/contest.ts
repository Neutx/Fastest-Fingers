export interface ContestSettings {
  startDate: string;
  startTime: string;
  duration: number; // in hours
  isActive: boolean;
}

export type ContestStatus = 'not-started' | 'active' | 'ended'; 