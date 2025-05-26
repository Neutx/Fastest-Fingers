import { Timestamp } from "firebase/firestore";

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  location: {
    ip: string;
    city: string;
    region: string;
    country: string;
    timezone: string;
    isp: string;
  };
  utm: {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    utm_content: string | null;
    referrer: string;
  };
  device: {
    userAgent: string;
    language: string;
    platform: string;
    screenResolution: string;
    timezone: string;
  };
  hasCompletedTest: boolean;
  testResult?: {
    wpm: number;
    accuracy: number;
    score: number;
  };
  bestScore: number;
  completedAt?: Timestamp;
  lastTestAt?: Timestamp;
} 