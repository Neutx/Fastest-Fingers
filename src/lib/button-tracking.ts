import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

interface ButtonClickData {
  buttonId: string;
  buttonText: string;
  page: string;
  userAgent: string;
  timestamp: ReturnType<typeof serverTimestamp>;
  sessionId: string;
  userId?: string;
  utm?: {
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_term?: string | null;
    utm_content?: string | null;
    referrer?: string;
  };
  location?: {
    ip?: string;
    country?: string;
    city?: string;
  };
}

// Generate a session ID for tracking anonymous users
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('kreo_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('kreo_session_id', sessionId);
  }
  return sessionId;
}

// Get UTM parameters from URL
function getUTMData() {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content'),
    referrer: document.referrer
  };
}

// Get basic location data (you can enhance this with IP geolocation)
async function getLocationData() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      ip: data.ip,
      country: data.country_name,
      city: data.city
    };
  } catch {
    // Location data collection failed
    return {};
  }
}

// Track button click
export async function trackButtonClick(
  buttonId: string,
  buttonText: string,
  userId?: string
): Promise<void> {
  try {
    if (typeof window === 'undefined') return;

    const locationData = await getLocationData();
    
    const clickData: ButtonClickData = {
      buttonId,
      buttonText,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: serverTimestamp(),
      sessionId: getSessionId(),
      utm: getUTMData(),
      location: locationData
    };

    // Only add userId if it exists
    if (userId) {
      clickData.userId = userId;
    }

    // Add to Firebase collection
    await addDoc(collection(db, 'button_clicks'), clickData);
    
      } catch {
      // Error tracking button click
    }
}

// Track specific "EXPLORE hive 65" button clicks
export async function trackExploreHive65Click(userId?: string): Promise<void> {
  return trackButtonClick('explore_hive_65', 'eXPLORE hive 65', userId);
} 