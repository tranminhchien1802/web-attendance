"use client";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ArrowUp, Check, CheckCircle2, CircleAlert, Loader2, X } from "lucide-react";
type Notice = { id: number; message: string; tone: "success" | "error" | "info" };
const ToastContext = createContext<(message: string, tone?: Notice["tone"]) => void>(() => {});
export const useToast = () => useContext(ToastContext);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sequence = useRef(0);
  const notify = useCallback((message: string, tone: Notice["tone"] = "success") => { const id = ++sequence.current; setNotices(old => [...old.slice(-2), { id, message, tone }]); timers.current.push(setTimeout(() => setNotices(old => old.filter(item => item.id !== id)), 5500)); }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return <ToastContext.Provider value={notify}>{children}<div className="plt-toasts" aria-live="polite" aria-atomic="false">{notices.map(item => <div key={item.id} className={`plt-toast plt-toast-${item.tone}`} role={item.tone === "error" ? "alert" : "status"}>{item.tone === "success" ? <CheckCircle2 size={20} /> : <CircleAlert size={20} />}<span>{item.message}</span><button type="button" aria-label="Đóng thông báo" onClick={() => setNotices(old => old.filter(n => n.id !== item.id))}><X size={16} /></button><span className="plt-toast-time" /></div>)}</div></ToastContext.Provider>;
}
export function ActionButton({ busy, success, children, variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean; success?: boolean; variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  return <button {...props} disabled={props.disabled || busy} className={`plt-button plt-button-${variant} ${className}`} aria-busy={busy || undefined}>{busy ? <Loader2 size={17} className="animate-spin" /> : success ? <Check size={17} className="plt-check" /> : null}{children}</button>;
}
export function Drawer({ open, title, description, children, onClose }: { open: boolean; title: string; description?: string; children: ReactNode; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null), headingId = useId(), close = useRef(onClose); close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null, previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]') ?? []).filter(node => node.getClientRects().length > 0);
    const timer = setTimeout(() => (focusable()[0] ?? panel.current)?.focus(), 50);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close.current(); }
      if (event.key === "Tab") { const elements = focusable(), first = elements[0], last = elements[elements.length - 1]; if (!first) { event.preventDefault(); panel.current?.focus(); return; } if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
    };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(timer); document.removeEventListener("keydown", onKey); document.body.style.overflow = previousOverflow; previous?.focus(); };
  }, [open]);
  if (!open) return null;
  return <div className="plt-drawer-wrap"><button className="plt-scrim" aria-label="Đóng bảng thông tin" onClick={onClose} /><div className="plt-drawer" ref={panel} role="dialog" aria-modal="true" aria-labelledby={headingId} tabIndex={-1}><header className="plt-drawer-heading"><div><span className="plt-eyebrow">PLT WORKSPACE</span><h2 id={headingId}>{title}</h2>{description && <p>{description}</p>}</div><button type="button" className="plt-icon-button" aria-label="Đóng" onClick={onClose}><X size={20} /></button></header>{children}</div></div>;
}
export function ConfirmDialog({ open, title, description, onConfirm, onCancel, busy = false, confirmLabel = "Xác nhận" }: { open: boolean; title: string; description: string; onConfirm: () => void; onCancel: () => void; busy?: boolean; confirmLabel?: string }) {
  return <Drawer open={open} title={title} description={description} onClose={() => { if (!busy) onCancel(); }}><div className="p-6"><div className="plt-confirm-art"><CircleAlert size={38} /></div><div className="mt-8 flex justify-end gap-3"><ActionButton variant="secondary" onClick={onCancel} disabled={busy}>Quay lại</ActionButton><ActionButton variant="danger" busy={busy} onClick={onConfirm}>{confirmLabel}</ActionButton></div></div></Drawer>;
}
export function EmptyState({ title, description, kind = "book", action }: { title: string; description: string; kind?: "book" | "calendar" | "search"; action?: ReactNode }) {
  return <div className="plt-empty"><svg viewBox="0 0 180 120" fill="none" aria-hidden="true" className="plt-empty-art"><ellipse cx="90" cy="104" rx="64" ry="8" fill="#E9E7F5" /><circle cx="90" cy="55" r="46" fill="#F0EFFA" /><circle cx="145" cy="25" r="5" fill="#D2CFF0" /><circle cx="34" cy="72" r="3" fill="#A7D8CE" /><rect x="53" y="25" width="74" height="69" rx="12" fill="white" stroke="#C9C5E7" strokeWidth="2" />{kind === "calendar" ? <><path d="M53 45h74M72 20v14m36-14v14" stroke="#7872B7" strokeWidth="3" strokeLinecap="round" /><rect x="68" y="57" width="16" height="15" rx="4" fill="#DAD6F4" /><path d="M96 61h15M96 70h10M69 82h41" stroke="#D1CDE8" strokeWidth="3" strokeLinecap="round" /></> : kind === "search" ? <><circle cx="85" cy="56" r="16" stroke="#7872B7" strokeWidth="3" /><path d="m97 68 14 14" stroke="#7872B7" strokeWidth="4" strokeLinecap="round" /></> : <><path d="M90 43v38M65 44c10-3 17-2 25 3 8-5 15-6 25-3v34c-11-2-17-1-25 3-8-4-14-5-25-3V44Z" stroke="#7872B7" strokeWidth="2.5" strokeLinejoin="round" /><path d="m72 53 10 2m-10 7 10 2m16-9 10-2m-10 11 10-2" stroke="#CCC7E8" strokeWidth="2.5" strokeLinecap="round" /></>}</svg><h3>{title}</h3><p>{description}</p>{action && <div className="mt-4">{action}</div>}</div>;
}
export function PageSkeleton() { return <div className="plt-page-skeleton" aria-label="Đang tải nội dung" role="status"><div className="plt-skeleton h-10 w-56" /><div className="plt-skeleton mt-5 h-44 w-full rounded-3xl" /><div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map(i => <div key={i} className="plt-skeleton h-28 rounded-2xl" />)}</div><div className="plt-skeleton mt-5 h-72 rounded-2xl" /><span className="sr-only">Đang tải dữ liệu…</span></div>; }
export function Progress({ value, tone = "brand" }: { value: number; tone?: "brand" | "success" | "warning" | "danger" }) { return <div className="plt-progress" role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}><span className={`plt-progress-${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>; }
export function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setDisplay(value); return; } let frame: number; const start = performance.now(); const tick = (now: number) => { const progress = Math.min(1, (now - start) / 500); setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3)))); if (progress < 1) frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame); }, [value]);
  return <span className="tabular-nums">{display.toLocaleString("vi-VN")}</span>;
}
export function SegmentedTabs({ value, items, onChange, label }: { value: string; items: { id: string; label: string; icon?: ReactNode }[]; onChange: (id: string) => void; label: string }) {
  const selected = Math.max(0, items.findIndex(item => item.id === value));
  return <div className="plt-tabs" role="tablist" aria-label={label} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}><span className="plt-tab-indicator" style={{ width: `calc((100% - 8px) / ${items.length})`, transform: `translateX(${selected * 100}%)` }} />{items.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={value === item.id} tabIndex={value === item.id ? 0 : -1} onClick={() => onChange(item.id)} onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); const next = (index + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length; onChange(items[next].id); (event.currentTarget.parentElement?.querySelectorAll("button")[next] as HTMLButtonElement)?.focus(); } }}>{item.icon}{item.label}</button>)}</div>;
}
export function BackToTop() { const [visible, setVisible] = useState(false); useEffect(() => { const update = () => setVisible(window.scrollY > 550); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []); return visible ? <button className="plt-back-top" aria-label="Về đầu trang" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}><ArrowUp size={19} /></button> : null; }
