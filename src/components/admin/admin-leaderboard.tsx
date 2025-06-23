"use client"

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Trophy, Medal, Award, Crown, RotateCcw } from "lucide-react";
import { UserData } from "@/types/admin";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AdminLeaderboardProps {
  users: UserData[];
}

export function AdminLeaderboard({ users }: AdminLeaderboardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const itemsPerPage = 20;

  // Filter and sort users by score (only those who completed the test)
  const leaderboardUsers = useMemo(() => {
    return users
      .filter(user => user.hasCompletedTest)
      .sort((a, b) => (b.bestScore || 0) - (a.bestScore || 0))
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));
  }, [users]);

  // Pagination
  const totalPages = Math.ceil(leaderboardUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = leaderboardUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleResetUser = (user: UserData) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const confirmReset = async () => {
    if (!selectedUser) return;

    setIsResetting(true);
    try {
      const userRef = doc(db, 'users', selectedUser.uid);
      
      await setDoc(userRef, {
        hasCompletedTest: false,
        testResult: null,
        bestScore: 0,
        completedAt: null,
        lastTestAt: serverTimestamp()
      }, { merge: true });

      // Close modal and reset state
      setShowConfirmModal(false);
      setSelectedUser(null);
      
      // Refresh the users data
      window.location.reload();
      
    } catch {
      // Error resetting user score
      alert('Failed to reset user score. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const cancelReset = () => {
    setShowConfirmModal(false);
    setSelectedUser(null);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={20} />;
      case 2:
        return <Trophy className="text-gray-400" size={18} />;
      case 3:
        return <Medal className="text-amber-600" size={18} />;
      default:
        return <Award className="text-gray-600" size={16} />;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50";
      default:
        return "bg-gray-800/50 border-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            🏆 Full Leaderboard
          </h2>
          <p className="text-gray-400">
            Complete ranking of all users who completed the typing test
          </p>
        </div>
        <div className="text-sm text-gray-400">
          {leaderboardUsers.length} qualified participants
        </div>
      </div>

      {/* Top 3 Podium */}
      {leaderboardUsers.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-6 text-center">🥇 Top 3 Champions</h3>
          <div className="flex justify-center items-end gap-8 max-w-md mx-auto">
            {/* 2nd Place */}
            <div className="text-center flex-1">
              <div className={`w-16 h-16 bg-gradient-to-b ${leaderboardUsers[1] ? 'from-gray-400 to-gray-600' : 'from-gray-600 to-gray-800'} rounded-full flex items-center justify-center mb-3 mx-auto ${!leaderboardUsers[1] ? 'opacity-50' : ''}`}>
                <Trophy className="text-white" size={24} />
              </div>
              <div className={`font-medium text-sm mb-1 ${leaderboardUsers[1] ? 'text-white' : 'text-gray-500'}`}>
                {leaderboardUsers[1]?.displayName || "Join the contest!"}
              </div>
              <div className="text-gray-400 text-xs mb-1">
                {leaderboardUsers[1]?.bestScore || "---"}
              </div>
              <div className="text-xs text-gray-500">2nd</div>
            </div>

            {/* 1st Place */}
            <div className="text-center flex-1">
              <div className={`w-20 h-20 bg-gradient-to-b ${leaderboardUsers[0] ? 'from-yellow-400 to-yellow-600' : 'from-gray-600 to-gray-800'} rounded-full flex items-center justify-center mb-3 mx-auto ${!leaderboardUsers[0] ? 'opacity-50' : ''}`}>
                <Crown className="text-white" size={28} />
              </div>
              <div className={`font-bold mb-1 ${leaderboardUsers[0] ? 'text-white' : 'text-gray-500'}`}>
                {leaderboardUsers[0]?.displayName || "Be the first!"}
              </div>
              <div className={`font-bold mb-1 ${leaderboardUsers[0] ? 'text-yellow-400' : 'text-gray-500'}`}>
                {leaderboardUsers[0]?.bestScore || "---"}
              </div>
              <div className="text-xs text-yellow-400">1st</div>
            </div>

            {/* 3rd Place */}
            <div className="text-center flex-1">
              <div className={`w-16 h-16 bg-gradient-to-b ${leaderboardUsers[2] ? 'from-amber-600 to-amber-800' : 'from-gray-600 to-gray-800'} rounded-full flex items-center justify-center mb-3 mx-auto ${!leaderboardUsers[2] ? 'opacity-50' : ''}`}>
                <Medal className="text-white" size={24} />
              </div>
              <div className={`font-medium text-sm mb-1 ${leaderboardUsers[2] ? 'text-white' : 'text-gray-500'}`}>
                {leaderboardUsers[2]?.displayName || "Be next!"}
              </div>
              <div className="text-gray-400 text-xs mb-1">
                {leaderboardUsers[2]?.bestScore || "---"}
              </div>
              <div className="text-xs text-gray-500">3rd</div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  WPM
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Completed
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
                  className={`border-b border-gray-800 transition-colors ${getRankStyle(user.rank)}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getRankIcon(user.rank)}
                      <span className={`font-bold ${
                        user.rank <= 3 ? 'text-white' : 'text-gray-300'
                      }`}>
                        #{user.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-white">{user.displayName}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold text-lg ${
                      user.rank === 1 ? 'text-yellow-400' :
                      user.rank === 2 ? 'text-gray-400' :
                      user.rank === 3 ? 'text-amber-600' :
                      'text-white'
                    }`}>
                      {user.bestScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white font-mono">
                      {user.testResult?.wpm || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white font-mono">
                      {user.testResult?.accuracy || 0}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300 text-sm">
                      {user.completedAt ? format(user.completedAt.toDate(), "MMM dd, yyyy") : "-"}
                    </span>
                  </td>
                                     <td className="px-4 py-3">
                     <div className="flex items-center gap-2">
                       <button
                         onClick={() => handleResetUser(user)}
                         className="text-sm text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded"
                         title={`Reset ${user.displayName}'s score`}
                         aria-label={`Reset ${user.displayName}'s score`}
                       >
                         <RotateCcw className="w-4 h-4" />
                       </button>
                     </div>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Last
            </button>
          </div>
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, leaderboardUsers.length)} of {leaderboardUsers.length}
          </div>
        </div>
      </div>

             {showConfirmModal && selectedUser && (
         <ConfirmModal
           isOpen={showConfirmModal}
           title="Reset User Score"
           message={`Are you sure you want to reset ${selectedUser.displayName}'s score? This will allow them to participate again.`}
           onConfirm={confirmReset}
           onClose={cancelReset}
           confirmText="Reset Score"
           cancelText="Cancel"
           isLoading={isResetting}
         />
       )}
    </div>
  );
} 