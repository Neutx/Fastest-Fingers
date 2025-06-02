"use client"

import { useState } from "react";
import { SimpleUsersTable } from "./simple-users-table";
import { AdminLeaderboard } from "./admin-leaderboard";
import { AdminSettings } from "./admin-settings";
import Image from "next/image";
import { UserData } from "@/types/admin";
import { ExportButton } from "./export-button";
import { StatsCards } from "./stats-cards";
import { Users, Trophy, Settings } from "lucide-react";

interface AdminDashboardProps {
  users: UserData[];
}

export function AdminDashboard({ users }: AdminDashboardProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'leaderboard' | 'settings'>('users');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/kreo.png"
              alt="KREO Logo"
              width={142}
              height={44}
            />
            <h1 className="text-2xl font-faster-one text-[#A578FD]">
              ADMIN DASHBOARD
            </h1>
          </div>
          {activeTab === 'users' && (
            <ExportButton 
              users={users} 
              selectedUserIds={selectedUsers}
            />
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Statistics Cards */}
        <StatsCards users={users} />

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-[#A578FD] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Users size={16} />
            User Data
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-[#A578FD] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Trophy size={16} />
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#A578FD] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' ? (
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-jost font-semibold text-white">
                User Data
              </h2>
              <p className="text-gray-400 mt-1">
                Complete overview of all registered users and their data
              </p>
            </div>
            <SimpleUsersTable 
              users={users}
              selectedUsers={selectedUsers}
              onSelectionChange={setSelectedUsers}
            />
          </div>
        ) : activeTab === 'leaderboard' ? (
          <AdminLeaderboard users={users} />
        ) : (
          <AdminSettings />
        )}
      </div>
    </div>
  );
} 