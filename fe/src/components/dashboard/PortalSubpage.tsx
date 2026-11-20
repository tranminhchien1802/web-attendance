"use client";
import type { ReactNode } from "react";
import { PortalFrame } from "./PortalFrame";
export function PortalSubpage({ title, description, children, actions }: { title: string; description: string; backHref?: string; children: ReactNode; actions?: ReactNode }) { return <PortalFrame title={title} description={description} actions={actions}>{children}</PortalFrame>; }
