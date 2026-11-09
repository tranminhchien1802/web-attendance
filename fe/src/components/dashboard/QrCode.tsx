import { useMemo } from "react";
import { encodeQrV1 } from "@/lib/qrCode";
export function QrCode({ value, size = 224 }: { value: string; size?: number }) {
  const matrix = useMemo(() => encodeQrV1(value), [value]);
  const path = matrix.flatMap((row, y) => row.flatMap((dark, x) => dark ? ["M" + (x + 4) + " " + (y + 4) + "h1v1h-1z"] : [])).join("");
  return <svg role="img" aria-label="Mã QR điểm danh" viewBox="0 0 29 29" width={size} height={size} className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><rect width="29" height="29" fill="white" /><path d={path} fill="#102b4e" /></svg>;
}