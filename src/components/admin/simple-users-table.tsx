"use client"

import { useState } from "react";
import { format } from "date-fns";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { UserData } from "@/types/admin";

interface SimpleUsersTableProps {
  users: UserData[];
  selectedUsers: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export function SimpleUsersTable({ users, selectedUsers, onSelectionChange }: SimpleUsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const itemsPerPage = 10;

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location?.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredUsers.map(user => user.uid));
    }
  };

  const handleSelectUser = (uid: string) => {
    if (selectedUsers.includes(uid)) {
      onSelectionChange(selectedUsers.filter(id => id !== uid));
    } else {
      onSelectionChange([...selectedUsers, uid]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-4 p-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A578FD]"
          />
        </div>
        <div className="text-sm text-gray-400">
          {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-[#A578FD] bg-gray-700 border-gray-600 rounded focus:ring-[#A578FD]"
                  title="Select all users"
                  aria-label="Select all users"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Verified
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Test Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                WPM
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Accuracy
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.uid}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.uid)}
                    onChange={() => handleSelectUser(user.uid)}
                    className="w-4 h-4 text-[#A578FD] bg-gray-700 border-gray-600 rounded focus:ring-[#A578FD]"
                    title={`Select user ${user.displayName || user.email}`}
                    aria-label={`Select user ${user.displayName || user.email}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    
                    <div>
                      <div className="font-medium text-white">{user.displayName}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.emailVerified 
                      ? "bg-green-900 text-green-300" 
                      : "bg-red-900 text-red-300"
                  }`}>
                    {user.emailVerified ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <div className="text-white">{user.location?.country}</div>
                    <div className="text-gray-400">{user.location?.city}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.hasCompletedTest 
                      ? "bg-green-900 text-green-300" 
                      : "bg-yellow-900 text-yellow-300"
                  }`}>
                    {user.hasCompletedTest ? "Completed" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white font-mono">
                    {user.testResult?.wpm || "-"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white font-mono">
                    {user.testResult?.accuracy ? `${user.testResult.accuracy}%` : "-"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white font-mono font-bold">
                    {user.bestScore || 0}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-300 text-sm">
                    {user.createdAt ? format(user.createdAt.toDate(), "MMM dd, yyyy") : "-"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-[#A578FD] hover:text-[#A578FD]/80 transition-colors"
                    title="View user details"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 flex items-center gap-1"
          >
            <ChevronLeft size={14} />
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 flex items-center gap-1"
          >
            Next
            <ChevronRight size={14} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
          >
            Last
          </button>
        </div>
        <div className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
}

// User Detail Modal Component
function UserDetailModal({ user, onClose }: { user: UserData; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">User Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
              title="Close modal"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Name:</span>
                <span className="text-white ml-2">{user.displayName}</span>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <span className="text-white ml-2">{user.email}</span>
              </div>
              <div>
                <span className="text-gray-400">UID:</span>
                <span className="text-white ml-2 font-mono text-xs">{user.uid}</span>
              </div>
              <div>
                <span className="text-gray-400">Verified:</span>
                <span className="text-white ml-2">{user.emailVerified ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Location</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Country:</span>
                <span className="text-white ml-2">{user.location?.country}</span>
              </div>
              <div>
                <span className="text-gray-400">City:</span>
                <span className="text-white ml-2">{user.location?.city}</span>
              </div>
              <div>
                <span className="text-gray-400">IP:</span>
                <span className="text-white ml-2 font-mono">{user.location?.ip}</span>
              </div>
              <div>
                <span className="text-gray-400">ISP:</span>
                <span className="text-white ml-2">{user.location?.isp}</span>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {user.testResult && (
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Test Results</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">WPM:</span>
                  <span className="text-white ml-2 font-mono">{user.testResult.wpm}</span>
                </div>
                <div>
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="text-white ml-2 font-mono">{user.testResult.accuracy}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Score:</span>
                  <span className="text-white ml-2 font-mono">{user.testResult.score}</span>
                </div>
              </div>
            </div>
          )}

          {/* Device Info */}
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Device Information</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Platform:</span>
                <span className="text-white ml-2">{user.device?.platform}</span>
              </div>
              <div>
                <span className="text-gray-400">Language:</span>
                <span className="text-white ml-2">{user.device?.language}</span>
              </div>
              <div>
                <span className="text-gray-400">Screen:</span>
                <span className="text-white ml-2">{user.device?.screenResolution}</span>
              </div>
              <div>
                <span className="text-gray-400">User Agent:</span>
                <span className="text-white ml-2 text-xs break-all">{user.device?.userAgent}</span>
              </div>
            </div>
          </div>

          {/* UTM Data */}
          {(user.utm?.utm_source || user.utm?.referrer) && (
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Marketing Data</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {user.utm.utm_source && (
                  <div>
                    <span className="text-gray-400">Source:</span>
                    <span className="text-white ml-2">{user.utm.utm_source}</span>
                  </div>
                )}
                {user.utm.utm_medium && (
                  <div>
                    <span className="text-gray-400">Medium:</span>
                    <span className="text-white ml-2">{user.utm.utm_medium}</span>
                  </div>
                )}
                {user.utm.referrer && (
                  <div className="col-span-2">
                    <span className="text-gray-400">Referrer:</span>
                    <span className="text-white ml-2 text-xs break-all">{user.utm.referrer}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 