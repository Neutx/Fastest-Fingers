import { useEffect, useState } from "react";

interface AnnouncementBannerProps {
  message?: string;
  className?: string;
}

export function AnnouncementBanner({ 
  message = "The top three contestants will undergo manual verification to ensure compliance with the competition rules. Any form of forgery or fraudulent activity will result in immediate disqualification, without the provision of any explanation.",
  className = ""
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={`relative bg-[#A578FD] text-white py-2 overflow-hidden ${className}`}>
      <div className="relative h-6 flex items-center">
        <div className="animate-scroll-infinite whitespace-nowrap">
          <span className="text-sm font-jost text-white">
            {message} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; {message} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; {message} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>
    </div>
  );
} 