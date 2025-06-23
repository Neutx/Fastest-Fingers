"use client"

import { useEffect } from 'react';

export function useAnimationObserver() {
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          
          // Use requestAnimationFrame for better performance
          requestAnimationFrame(() => {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
            
            // Disconnect observer for this element after animation
            observer.unobserve(target);
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    // Use a shorter timeout for faster initialization
    const timeoutId = setTimeout(() => {
      const animatedElements = document.querySelectorAll('.animate-fade-in-up');
      animatedElements.forEach((el) => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);
} 