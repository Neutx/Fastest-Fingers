"use client"

import { Users, Trophy, MousePointer, Calendar, RotateCw } from "lucide-react";
import { UserData } from "@/types/admin";
import { useState, useEffect } from "react";
import { getExploreHive65Analytics, ButtonClickAnalytics, resetExploreHive65Analytics } from "@/lib/admin-analytics";

interface StatsCardsProps {
  users: UserData[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onReset?: () => Promise<void>;
  isResettable?: boolean;
}

function StatCard({ title, value, icon, description, trend, onReset, isResettable }: StatCardProps) {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (onReset) {
      setIsResetting(true);
      try {
        await onReset();
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-[#A578FD]/50 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <p className="text-gray-500 text-xs mt-1">{description}</p>
        </div>
        <div className="text-[#A578FD] flex items-center">
          {isResettable && (
            <button 
              onClick={handleReset} 
              disabled={isResetting}
              className="mr-4 p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50"
              aria-label="Reset stat"
            >
              <RotateCw size={18} className={isResetting ? "animate-spin" : ""} />
            </button>
          )}
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-gray-500 text-sm ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
}

export function StatsCards({ users }: StatsCardsProps) {
  const [buttonAnalytics, setButtonAnalytics] = useState<ButtonClickAnalytics | null>(null);

  const fetchAnalytics = async () => {
    const analytics = await getExploreHive65Analytics();
    setButtonAnalytics(analytics);
  };

  // Fetch button click analytics
  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleResetExploreHiveClicks = async () => {
    await resetExploreHive65Analytics();
    await fetchAnalytics(); // Re-fetch analytics after resetting
  };

  // Calculate statistics
  const totalUsers = users.length;
  const completedTests = users.filter(user => user.hasCompletedTest).length;
  const averageWPM = users
    .filter(user => user.testResult?.wpm)
    .reduce((sum, user) => sum + (user.testResult?.wpm || 0), 0) / 
    (users.filter(user => user.testResult?.wpm).length || 1);
  
  // Real button click data
  const clickedExploreHive65 = buttonAnalytics?.totalClicks || 0;
  
  // Users from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayUsers = users.filter(user => {
    if (!user.createdAt) return false;
    const userDate = user.createdAt.toDate();
    return userDate >= today;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="Total Users"
        value={totalUsers}
        icon={<Users size={24} />}
        description="Total registered users"
        trend={{ value: 12, isPositive: true }}
      />
      
      <StatCard
        title="Clicked EXPLORE hive 65"
        value={clickedExploreHive65}
        icon={<MousePointer size={24} />}
        description="Users who signed up"
        trend={{ value: 8, isPositive: true }}
        isResettable={true}
        onReset={handleResetExploreHiveClicks}
      />
      
      <StatCard
        title="Completed Tests"
        value={completedTests}
        icon={<Trophy size={24} />}
        description="Users who finished typing test"
        trend={{ value: 15, isPositive: true }}
      />
      
      <StatCard
        title="Average WPM"
        value={Math.round(averageWPM)}
        icon={<Trophy size={24} />}
        description="Average words per minute"
        trend={{ value: 3, isPositive: true }}
      />
      
      <StatCard
        title="Today's Signups"
        value={todayUsers}
        icon={<Calendar size={24} />}
        description="New users today"
        trend={{ value: 25, isPositive: true }}
      />
    </div>
  );
} 