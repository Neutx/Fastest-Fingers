"use client"

import { useEffect, useRef } from 'react';
import type LocomotiveScroll from 'locomotive-scroll';

export function useLocomotiveScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    let locomotiveScroll: LocomotiveScroll | null = null;

    const initLocomotiveScroll = async () => {
      const LocomotiveScrollClass = (await import('locomotive-scroll')).default;
      
      if (scrollRef.current) {
        locomotiveScroll = new LocomotiveScrollClass({
          el: scrollRef.current,
          smooth: true,
          multiplier: 0.6, // Reduced for smoother performance
          class: 'is-revealed',
          scrollbarContainer: false,
          // Performance optimizations
          reloadOnContextChange: false,
          touchMultiplier: 2,
          firefoxMultiplier: 50,
        });

        locomotiveScrollRef.current = locomotiveScroll;
      }
    };

    initLocomotiveScroll();

    return () => {
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
      }
    };
  }, []);

  return { scrollRef, locomotiveScroll: locomotiveScrollRef.current };
} 