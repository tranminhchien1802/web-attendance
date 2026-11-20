"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { fetchMe, getCurrentUser, type AppUser } from "@/lib/auth";
type Session = { user: AppUser | null; loading: boolean; error: string; refresh: () => void };
const Context = createContext<Session>({ user: null, loading: true, error: "", refresh: () => {} });
export const useSession = () => useContext(Context);
export function SessionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname(), protectedPage = /^\/(dashboard|student|teacher)(\/|$)/.test(pathname);
  const [user, setUser] = useState<AppUser | null>(null), [loading, setLoading] = useState(true), [error, setError] = useState("");
  const refresh = useCallback(() => { setLoading(true); setError(""); fetchMe().then(setUser).catch(() => setError("Chưa thể tải phiên làm việc. Kiểm tra kết nối và thử lại.")).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (protectedPage) refresh(); else setLoading(false); }, [protectedPage, refresh]);
  useEffect(() => { const update = () => { setUser(getCurrentUser()); setError(""); }; window.addEventListener("plt:session", update); return () => window.removeEventListener("plt:session", update); }, []);
  return <Context.Provider value={{ user, loading, error, refresh }}>{children}</Context.Provider>;
}
