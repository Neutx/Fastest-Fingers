"use client"

import { useState, useEffect } from "react"
import { useContestSettings } from "./use-contest-settings"
import { ContestStatus } from "@/types/contest"

interface UseTimerProps {
  initialTime?: string
}

export function useTimer({ initialTime = "99:59:59" }: UseTimerProps = {}) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [contestStatus, setContestStatus] = useState<ContestStatus>('not-started')
  const { settings: contestSettings } = useContestSettings()

  // Update countdown based on real contest settings
  useEffect(() => {
    if (!contestSettings || !contestSettings.isActive) {
      setTimeLeft(initialTime);
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const startDateTime = new Date(`${contestSettings.startDate}T${contestSettings.startTime}`).getTime();
      const endDateTime = startDateTime + (contestSettings.duration * 60 * 60 * 1000);

      if (now < startDateTime) {
        // Contest hasn't started yet - show countdown to start
        const timeDiff = startDateTime - now;
        setContestStatus('not-started');
        setTimeLeft(formatTime(timeDiff));
      } else if (now >= startDateTime && now < endDateTime) {
        // Contest is active - show countdown to end
        const timeDiff = endDateTime - now;
        setContestStatus('active');
        setTimeLeft(formatTime(timeDiff));
      } else {
        // Contest has ended
        setContestStatus('ended');
        setTimeLeft("00:00:00");
      }
    };

    updateCountdown(); // Initial call
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [contestSettings, initialTime]);

  const formatTime = (milliseconds: number): string => {
    if (milliseconds <= 0) return "00:00:00";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return { 
    timeLeft, 
    contestStatus, 
    contestSettings,
    isContestActive: contestStatus === 'active',
    hasContestEnded: contestStatus === 'ended',
    hasContestStarted: contestStatus !== 'not-started'
  }
} 