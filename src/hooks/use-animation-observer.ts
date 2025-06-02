"use client"

import { useEffect } from 'react';

export function useAnimationObserver() {
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          
          requestAnimationFrame(() => {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Use a timeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      // Observe all elements with fade-in animation
      const animatedElements = document.querySelectorAll('.animate-fade-in-up');
      animatedElements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);
} 