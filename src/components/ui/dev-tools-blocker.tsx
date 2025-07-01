"use client"

import { useEffect } from 'react';

export function DevToolsBlocker() {
  useEffect(() => {
    // More aggressive right-click disabling
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    // Disable developer tools keyboard shortcuts
    const disableDevToolsKeys = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123 || e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.key === 'I')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 74 || e.key === 'J')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.keyCode === 85 || e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      
      // Ctrl+Shift+C (Element Inspector)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 67 || e.key === 'C')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      
      // Ctrl+Shift+K (Web Console in Firefox)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 75 || e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      
      // Ctrl+Shift+E (Network Monitor)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 69 || e.key === 'E')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }

      // Additional shortcuts
      // Ctrl+Shift+M (Responsive Design Mode)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 77 || e.key === 'M')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }

      // Ctrl+Shift+R (Hard Refresh)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 82 || e.key === 'R')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    // Disable text selection
    const disableSelection = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable drag and drop
    const disableDragDrop = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable print
    const disablePrint = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // DevTools detection
    let devtools = { open: false };
    const threshold = 160;

    const detectDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          // Show warning or redirect
          alert('Developer tools are not allowed during the contest!');
          // Optionally redirect to homepage
          // window.location.href = '/';
        }
      } else {
        devtools.open = false;
      }
    };

    // Console warning
    const consoleWarning = () => {
      const style = 'color: red; font-size: 50px; font-weight: bold;';
      console.log('%cSTOP!', style);
      console.log('%cThis is a browser feature intended for developers. Using console commands to manipulate the contest is strictly prohibited and will result in immediate disqualification.', 'color: red; font-size: 16px;');
    };

    // Add event listeners with capture phase to catch events early
    document.addEventListener('contextmenu', disableRightClick, true);
    document.addEventListener('keydown', disableDevToolsKeys, true);
    document.addEventListener('keyup', disableDevToolsKeys, true);
    document.addEventListener('selectstart', disableSelection, true);
    document.addEventListener('dragstart', disableDragDrop, true);
    document.addEventListener('mousedown', disableRightClick, true);
    window.addEventListener('beforeprint', disablePrint, true);

    // Additional event listeners for mobile
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
        return false;
      }
    }, true);

    // Disable image saving
    document.addEventListener('dragstart', (e) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
        return false;
      }
    }, true);

    // Start DevTools detection
    const detectionInterval = setInterval(detectDevTools, 1000);

    // Show console warning
    consoleWarning();

    // Anti-debugging measures
    const antiDebug = () => {
      const startTime = new Date().getTime();
      debugger;
      const endTime = new Date().getTime();
      
      if (endTime - startTime > 100) {
        // DevTools likely open
        alert('Developer tools detected! Please close them to continue.');
        window.location.reload();
      }
    };

    // Run anti-debug check periodically
    const antiDebugInterval = setInterval(antiDebug, 3000);

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', disableRightClick, true);
      document.removeEventListener('keydown', disableDevToolsKeys, true);
      document.removeEventListener('keyup', disableDevToolsKeys, true);
      document.removeEventListener('selectstart', disableSelection, true);
      document.removeEventListener('dragstart', disableDragDrop, true);
      document.removeEventListener('mousedown', disableRightClick, true);
      window.removeEventListener('beforeprint', disablePrint, true);
      clearInterval(detectionInterval);
      clearInterval(antiDebugInterval);
    };
  }, []);

  return null; // This component doesn't render anything
} 