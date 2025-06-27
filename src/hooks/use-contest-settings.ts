"use client"

import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ContestSettings } from "@/types/contest"

export function useContestSettings() {
  const [settings, setSettings] = useState<ContestSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const settingsRef = doc(db, 'admin', 'contestSettings');
    
    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as ContestSettings);
      } else {
        setSettings(null);
      }
      setIsLoading(false);
    }, () => {
      // Error fetching contest settings
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getFormattedStartDateTime = (): string => {
    if (!settings || !settings.startDate || !settings.startTime) return 'DD-MM-YYYY at HH:MM';
    
    const startDateTime = new Date(`${settings.startDate}T${settings.startTime}`);
    
    return startDateTime.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getFormattedEndDateTime = (): string => {
    if (!settings || !settings.startDate || !settings.startTime) return '';
    
    const startDateTime = new Date(`${settings.startDate}T${settings.startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + (settings.duration * 60 * 60 * 1000));
    
    return endDateTime.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return {
    settings,
    isLoading,
    getFormattedStartDateTime,
    getFormattedEndDateTime,
    isActive: settings?.isActive ?? false,
    hive65Link: settings?.hive65Link,
    tweetLink: settings?.tweetLink
  }
} 