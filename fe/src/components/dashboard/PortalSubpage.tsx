import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
export function PortalSubpage({ title, description, backHref, children, actions }: { title: string; description: string; backHref: string; children: ReactNode; actions?: ReactNode }) {
  return <main className="min-h-screen bg-[#f4f7fb] text-slate-800">
    <header className="border-b border-white/10 bg-[#0d3159] text-white shadow-sm"><div className="mx-auto flex min-h-[68px] max-w-[1320px] items-center gap-3 px-4 sm:px-6"><div className="flex h-10 min-w-[76px] items-center justify-center rounded-md bg-white px-2"><Image src="/images/logo.png" alt="Logo công ty" width={720} height={424} className="h-8 w-auto object-contain" /></div><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-blue-200">Cổng đào tạo</p><p className="text-sm font-bold">Công ty TNHH Phan Gia Phước</p></div></div></header>
    <div className="mx-auto max-w-[1320px] px-3 py-5 sm:px-6 sm:py-7"><section className="relative mb-5 flex min-h-[190px] flex-wrap items-end justify-between gap-4 overflow-hidden rounded-[24px] bg-[#103d70] bg-cover bg-center p-5 text-white shadow-lg sm:min-h-[220px] sm:p-7" style={{ backgroundImage: "linear-gradient(90deg, rgba(11,44,80,.96), rgba(13,61,106,.72), rgba(13,49,89,.3)), url('/images/hcmute-campus.jpg')" }}><div className="max-w-2xl"><Link href={backHref} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-100 hover:text-white"><ChevronLeft className="h-4 w-4" />Tổng quan</Link><p className="mt-4 text-[10px] font-bold uppercase tracking-[.18em] text-cyan-200">Cổng đào tạo · HCMUTE</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1><p className="mt-2 text-sm leading-6 text-blue-50/90">{description}</p></div>{actions ? <div>{actions}</div> : null}</section>{children}</div>
  </main>;
}
