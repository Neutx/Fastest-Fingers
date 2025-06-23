"use client"

import { useState, useEffect, createContext, useContext } from "react";
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Function to collect user tracking data
async function collectUserData(user: User) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    // Get location and other tracking data
    let locationData = {};
    try {
      // Get user's IP and location data
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      locationData = {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        timezone: data.timezone,
        isp: data.org
      };
    } catch {
      // Error fetching IP data
    }

    // Get UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      referrer: document.referrer
    };

    // Browser and device info
    const deviceData = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      createdAt: userSnap.exists() ? userSnap.data().createdAt : serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      location: locationData,
      utm: utmData,
      device: deviceData,
      // Contest specific data
      hasCompletedTest: userSnap.exists() ? userSnap.data().hasCompletedTest || false : false,
      testResults: userSnap.exists() ? userSnap.data().testResults || [] : [],
      bestScore: userSnap.exists() ? userSnap.data().bestScore || 0 : 0
    };

    await setDoc(userRef, userData, { merge: true });
  } catch {
    // Error collecting user data
  }
}

export function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await collectUserData(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      setLoading(false); // Set loading to false immediately after sign-in
      
      collectUserData(result.user).catch(() => {});
    } catch {
      // Error signing in with Google
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      // Error signing out
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOut
  };
} 