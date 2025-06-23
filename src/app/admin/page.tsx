"use client"

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { LoadingAnimation } from "@/components/ui/loading";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData } from "@/types/admin";

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!loading && user) {
      if (user.uid === ADMIN_UID) {
        setIsAuthorized(true);
      } else {
        // Redirect non-admin users
        router.push('/');
      }
    } else if (!loading && !user) {
      // Redirect unauthenticated users
      router.push('/');
    }
  }, [user, loading, router]);

  // Function to fetch users data
  const fetchUsers = useCallback(async () => {
    if (isAuthorized) {
      try {
        setIsLoadingData(true);
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const usersData: UserData[] = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ ...doc.data() } as UserData);
        });
        
        setUsers(usersData);
      } catch {
        // Error fetching users
      } finally {
        setIsLoadingData(false);
      }
    }
  }, [isAuthorized]);

  // Fetch all users data on initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Show loading while checking auth or loading data
  if (loading || isLoadingData) {
    return <LoadingAnimation />;
  }

  // Don't render if not authorized
  if (!isAuthorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black">
      <AdminDashboard users={users} />
    </main>
  );
} 