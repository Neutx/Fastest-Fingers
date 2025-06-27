import { collection, query, where, getDocs, orderBy, Timestamp, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

interface ButtonClickData {
  id: string;
  buttonId: string;
  buttonText: string;
  page: string;
  userAgent: string;
  timestamp: Timestamp;
  sessionId: string;
  userId?: string;
  utm?: Record<string, string | null>;
  location?: Record<string, string>;
}

export interface ButtonClickAnalytics {
  totalClicks: number;
  uniqueUsers: number;
  uniqueSessions: number;
  clicksByPage: Record<string, number>;
  clicksByDate: Record<string, number>;
  recentClicks: Array<{
    timestamp: Date;
    userId?: string;
    sessionId: string;
    page: string;
    utm?: Record<string, string | null>;
  }>;
}

export async function getExploreHive65Analytics(): Promise<ButtonClickAnalytics> {
  try {
    const clicksRef = collection(db, 'button_clicks');
    const q = query(
      clicksRef, 
      where('buttonId', '==', 'explore_hive_65')
    );
    
    const querySnapshot = await getDocs(q);
    const clicks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ButtonClickData[];

    // Sort by timestamp in JavaScript (since we removed orderBy from query)
    clicks.sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0;
      return b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime();
    });

    // Calculate analytics
    const totalClicks = clicks.length;
    const uniqueUsers = new Set(clicks.filter(click => click.userId).map(click => click.userId)).size;
    const uniqueSessions = new Set(clicks.map(click => click.sessionId)).size;
    
    // Group by page
    const clicksByPage: Record<string, number> = {};
    clicks.forEach(click => {
      clicksByPage[click.page] = (clicksByPage[click.page] || 0) + 1;
    });

    // Group by date
    const clicksByDate: Record<string, number> = {};
    clicks.forEach(click => {
      if (click.timestamp && click.timestamp.toDate) {
        const date = click.timestamp.toDate().toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;
      }
    });

    // Recent clicks (last 10)
    const recentClicks = clicks.slice(0, 10).map(click => ({
      timestamp: click.timestamp?.toDate() || new Date(),
      userId: click.userId,
      sessionId: click.sessionId,
      page: click.page,
      utm: click.utm
    }));

    return {
      totalClicks,
      uniqueUsers,
      uniqueSessions,
      clicksByPage,
      clicksByDate,
      recentClicks
    };
  } catch {
    // Error fetching button analytics
    return {
      totalClicks: 0,
      uniqueUsers: 0,
      uniqueSessions: 0,
      clicksByPage: {},
      clicksByDate: {},
      recentClicks: []
    };
  }
}

export async function resetExploreHive65Analytics(): Promise<{ success: boolean; error?: string }> {
  try {
    const clicksRef = collection(db, 'button_clicks');
    const q = query(clicksRef, where('buttonId', '==', 'explore_hive_65'));
    const querySnapshot = await getDocs(q);

    // Use a batched write to delete all documents
    const batch = writeBatch(db);
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}

export async function getAllButtonClicks() {
  try {
    const clicksRef = collection(db, 'button_clicks');
    const q = query(clicksRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
      } catch {
      // Error fetching all button clicks
      return [];
    }
} 