"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, type UserRole } from "@/lib/auth";

const homeForRole: Record<UserRole, string> = {
  student: "/student/Index",
  teacher: "/teacher/Index",
  admin: "/dashboard",
};

export function RoleGate({ role, children }: { role: UserRole; children: ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace(homeForRole[user.role]);
      return;
    }
    setAllowed(true);
  }, [role, router]);

  if (!allowed) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f4f7fb] text-sm text-slate-500">Đang mở cổng thông tin…</main>;
  }

  return children;
}
