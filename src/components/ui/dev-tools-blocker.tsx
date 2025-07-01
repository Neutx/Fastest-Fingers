"use client"

import { useEffect } from 'react';

export function DevToolsBlocker() {
  useEffect(() => {
    // Disable right-click context menu
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable developer tools keyboard shortcuts
    const disableDevToolsKeys = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Element Inspector)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+K (Web Console in Firefox)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
        e.preventDefault();
        return false;
      }
      
      // F12 (DevTools)
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+E (Network Monitor)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 69) {
        e.preventDefault();
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

    // Add event listeners
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableDevToolsKeys);
    document.addEventListener('selectstart', disableSelection);
    document.addEventListener('dragstart', disableDragDrop);
    window.addEventListener('beforeprint', disablePrint);

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
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableDevToolsKeys);
      document.removeEventListener('selectstart', disableSelection);
      document.removeEventListener('dragstart', disableDragDrop);
      window.removeEventListener('beforeprint', disablePrint);
      clearInterval(detectionInterval);
      clearInterval(antiDebugInterval);
    };
  }, []);

  return null; // This component doesn't render anything
} 