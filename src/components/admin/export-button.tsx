"use client"

import { Download } from "lucide-react";
import { format } from "date-fns";
import { UserData } from "@/types/admin";

interface ExportButtonProps {
  users: UserData[];
  selectedUserIds: string[];
}

export function ExportButton({ users, selectedUserIds }: ExportButtonProps) {
  const exportToCSV = () => {
    // Filter users if specific ones are selected
    const usersToExport = selectedUserIds.length > 0 
      ? users.filter(user => selectedUserIds.includes(user.uid))
      : users;

    if (usersToExport.length === 0) {
      alert("No users to export");
      return;
    }

    // Define CSV headers
    const headers = [
      "UID",
      "Name",
      "Email",
      "Email Verified",
      "Created At",
      "Last Login",
      "Country",
      "City",
      "Region",
      "IP Address",
      "ISP",
      "Timezone",
      "Has Completed Test",
      "WPM",
      "Accuracy",
      "Score",
      "Best Score",
      "Completed At",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "Referrer",
      "Platform",
      "Language",
      "Screen Resolution",
      "User Agent"
    ];

    // Convert users to CSV rows
    const csvRows = usersToExport.map(user => [
      user.uid,
      user.displayName || "",
      user.email || "",
      user.emailVerified ? "Yes" : "No",
      user.createdAt ? format(user.createdAt.toDate(), "yyyy-MM-dd HH:mm:ss") : "",
      user.lastLoginAt ? format(user.lastLoginAt.toDate(), "yyyy-MM-dd HH:mm:ss") : "",
      user.location?.country || "",
      user.location?.city || "",
      user.location?.region || "",
      user.location?.ip || "",
      user.location?.isp || "",
      user.location?.timezone || "",
      user.hasCompletedTest ? "Yes" : "No",
      user.testResult?.wpm || "",
      user.testResult?.accuracy || "",
      user.testResult?.score || "",
      user.bestScore || 0,
      user.completedAt ? format(user.completedAt.toDate(), "yyyy-MM-dd HH:mm:ss") : "",
      user.utm?.utm_source || "",
      user.utm?.utm_medium || "",
      user.utm?.utm_campaign || "",
      user.utm?.referrer || "",
      user.device?.platform || "",
      user.device?.language || "",
      user.device?.screenResolution || "",
      user.device?.userAgent || ""
    ]);

    // Escape CSV values and handle commas/quotes
    const escapeCsvValue = (value: string | number) => {
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.map(escapeCsvValue).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `kreo-users-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 px-4 py-2 bg-[#A578FD] text-white rounded-lg hover:bg-[#A578FD]/80 transition-colors"
    >
      <Download size={16} />
      Export {selectedUserIds.length > 0 ? `Selected (${selectedUserIds.length})` : 'All'} Users
    </button>
  );
} 