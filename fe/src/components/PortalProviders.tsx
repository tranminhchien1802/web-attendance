"use client";
import type { ReactNode } from "react";
import { SessionProvider } from "./auth/SessionProvider";
import { BackToTop, ToastProvider } from "./ui/PortalUI";
export function PortalProviders({ children }: { children: ReactNode }) { return <ToastProvider><SessionProvider>{children}<BackToTop /></SessionProvider></ToastProvider>; }
