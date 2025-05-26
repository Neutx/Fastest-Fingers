export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 
    'windows phone', 'mobile', 'opera mini', 'iemobile'
  ];
  
  const isMobileUserAgent = mobileKeywords.some(keyword => 
    userAgent.includes(keyword)
  );
  
  // Check screen size (even if desktop view is enabled)
  const hasSmallScreen = window.screen.width <= 1024 || window.screen.height <= 768;
  
  // Check touch capability
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check device pixel ratio (mobile devices typically have higher DPR)
  const hasHighDPR = window.devicePixelRatio > 1.5;
  
  // Check orientation API (mainly available on mobile)
  const hasOrientationAPI = 'orientation' in window;
  
  // Combine checks - if any mobile indicator is true, consider it mobile
  return isMobileUserAgent || 
         (hasSmallScreen && hasTouchScreen) || 
         (hasTouchScreen && hasHighDPR && hasOrientationAPI);
}

export function getDeviceType(): 'mobile' | 'desktop' {
  return isMobileDevice() ? 'mobile' : 'desktop';
} 