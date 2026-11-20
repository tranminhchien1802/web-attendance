"use client";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/auth";
import { useSession } from "./auth/SessionProvider";
import { ActionButton, EmptyState, PageSkeleton } from "./ui/PortalUI";
export const homeForRole: Record<UserRole, string> = { student: "/student/Index", teacher: "/teacher/Index", admin: "/dashboard" };
export function RoleGate({ role, children }: { role?: UserRole; children: ReactNode }) {
  const router = useRouter();
  const { user, loading, error, refresh } = useSession();
  useEffect(() => { if (loading || error) return; if (!user) router.replace("/login"); else if (role && user.role !== role) router.replace(homeForRole[user.role]); }, [user, loading, error, role, router]);
  if (error) return <main className="plt-session-screen"><EmptyState title="Kết nối đang gián đoạn" description={error} kind="search" action={<ActionButton onClick={refresh}>Thử lại</ActionButton>} /></main>;
  if (loading || !user || (role && user.role !== role)) return <main className="plt-session-screen"><PageSkeleton /></main>;
  return children;
}
