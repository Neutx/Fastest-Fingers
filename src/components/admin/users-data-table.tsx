"use client"

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronUp, ChevronDown, Search, Eye } from "lucide-react";
import Image from "next/image";
import { UserData } from "@/types/admin";

interface UsersDataTableProps {
  users: UserData[];
  selectedUsers: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const columnHelper = createColumnHelper<UserData>();

export function UsersDataTable({ users, selectedUsers, onSelectionChange }: UsersDataTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<UserData, any>[]>(() => [
    // Selection checkbox
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="w-4 h-4 text-[#A578FD] bg-gray-700 border-gray-600 rounded focus:ring-[#A578FD]"
          aria-label="Select all users"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="w-4 h-4 text-[#A578FD] bg-gray-700 border-gray-600 rounded focus:ring-[#A578FD]"
          aria-label={`Select user ${row.original.displayName || row.original.email}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // Profile Picture & Name
    columnHelper.accessor("displayName", {
      header: "User",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <Image
            src={info.row.original.photoURL || "/kreo.png"}
            alt={info.getValue() || "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <div className="font-medium text-white">{info.getValue()}</div>
            <div className="text-sm text-gray-400">{info.row.original.email}</div>
          </div>
        </div>
      ),
    }),
    // Email Verified
    columnHelper.accessor("emailVerified", {
      header: "Verified",
      cell: (info) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          info.getValue() 
            ? "bg-green-900 text-green-300" 
            : "bg-red-900 text-red-300"
        }`}>
          {info.getValue() ? "Yes" : "No"}
        </span>
      ),
    }),
    // Location
    columnHelper.accessor("location.country", {
      header: "Location",
      cell: (info) => (
        <div className="text-sm">
          <div className="text-white">{info.getValue()}</div>
          <div className="text-gray-400">{info.row.original.location.city}</div>
        </div>
      ),
    }),
    // Test Status
    columnHelper.accessor("hasCompletedTest", {
      header: "Test Status",
      cell: (info) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          info.getValue() 
            ? "bg-green-900 text-green-300" 
            : "bg-yellow-900 text-yellow-300"
        }`}>
          {info.getValue() ? "Completed" : "Pending"}
        </span>
      ),
    }),
    // WPM
    columnHelper.accessor("testResult.wpm", {
      header: "WPM",
      cell: (info) => (
        <span className="text-white font-mono">
          {info.getValue() || "-"}
        </span>
      ),
    }),
    // Accuracy
    columnHelper.accessor("testResult.accuracy", {
      header: "Accuracy",
      cell: (info) => (
        <span className="text-white font-mono">
          {info.getValue() ? `${info.getValue()}%` : "-"}
        </span>
      ),
    }),
    // Score
    columnHelper.accessor("bestScore", {
      header: "Best Score",
      cell: (info) => (
        <span className="text-white font-mono font-bold">
          {info.getValue() || 0}
        </span>
      ),
    }),
    // Created At
    columnHelper.accessor("createdAt", {
      header: "Joined",
      cell: (info) => (
        <span className="text-gray-300 text-sm">
          {info.getValue() ? format(info.getValue().toDate(), "MMM dd, yyyy") : "-"}
        </span>
      ),
    }),
    // Actions
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedUser(row.original)}
          className="text-[#A578FD] hover:text-[#A578FD]/80 transition-colors"
          aria-label="View user details"
        >
          <Eye size={16} />
        </button>
      ),
      enableSorting: false,
    },
  ], []);

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      rowSelection: selectedUsers.reduce((acc, id) => ({ ...acc, [id]: true }), {}),
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' 
        ? updater(selectedUsers.reduce((acc, id) => ({ ...acc, [id]: true }), {}))
        : updater;
      onSelectionChange(Object.keys(newSelection));
    },
    getRowId: (row) => row.uid,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-4 p-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A578FD]"
          />
        </div>
        <div className="text-sm text-gray-400">
          {table.getFilteredRowModel().rows.length} of {users.length} users
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-800">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="text-[#A578FD]">
                          {header.column.getIsSorted() === "desc" ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronUp size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
          >
            First
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
          >
            Next
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
          >
            Last
          </button>
        </div>
        <div className="text-sm text-gray-400">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
              className="text-gray-400 hover:text-white transition-colors"
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
                <span className="text-white ml-2">{user.location.country}</span>
              </div>
              <div>
                <span className="text-gray-400">City:</span>
                <span className="text-white ml-2">{user.location.city}</span>
              </div>
              <div>
                <span className="text-gray-400">IP:</span>
                <span className="text-white ml-2 font-mono">{user.location.ip}</span>
              </div>
              <div>
                <span className="text-gray-400">ISP:</span>
                <span className="text-white ml-2">{user.location.isp}</span>
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
                <span className="text-white ml-2">{user.device.platform}</span>
              </div>
              <div>
                <span className="text-gray-400">Language:</span>
                <span className="text-white ml-2">{user.device.language}</span>
              </div>
              <div>
                <span className="text-gray-400">Screen:</span>
                <span className="text-white ml-2">{user.device.screenResolution}</span>
              </div>
              <div>
                <span className="text-gray-400">User Agent:</span>
                <span className="text-white ml-2 text-xs break-all">{user.device.userAgent}</span>
              </div>
            </div>
          </div>

          {/* UTM Data */}
          {(user.utm.utm_source || user.utm.referrer) && (
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