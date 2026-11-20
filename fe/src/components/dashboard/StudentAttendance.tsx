"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, ClipboardCheck, Info, QrCode, Search } from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import { useSession } from "@/components/auth/SessionProvider";
import { ActionButton, Drawer, EmptyState, Progress, useToast } from "@/components/ui/PortalUI";
import { getAbsenceSummary, getAttendanceDays, getClassAttendance, getClassesForStudent, getLocalDateKey, markPresentWithQr, type AttendanceStatus } from "@/lib/portalData";
import { courseColor, formatDate } from "@/lib/presentation";
import { usePortalData } from "@/lib/usePortalData";
import { PortalSubpage } from "./PortalSubpage";
type Detector = { detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]> };
function CameraScanner({ open, onClose, onRead }: { open: boolean; onClose: () => void; onRead: (value: string) => void }) {
  const video = useRef<HTMLVideoElement>(null), read = useRef(onRead);
  read.current = onRead;
  const [error, setError] = useState("");
  useEffect(() => {
    if (!open) return;
    setError(""); let stream: MediaStream | undefined, stopped = false, timer: ReturnType<typeof setTimeout>;
    const start = async () => {
      try {
        const Constructor = (window as unknown as { BarcodeDetector?: new (config: { formats: string[] }) => Detector }).BarcodeDetector;
        if (!Constructor) { setError("Trình duyệt này chưa hỗ trợ quét QR trực tiếp. Bạn có thể dùng camera điện thoại để đọc mã rồi nhập mã 16 ký tự."); return; }
        if (!navigator.mediaDevices?.getUserMedia) { setError("Camera cần kết nối an toàn HTTPS hoặc localhost. Bạn vẫn có thể nhập mã thủ công."); return; }
        const detector = new Constructor({ formats: ["qr_code"] });
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        if (stopped) { stream.getTracks().forEach(track => track.stop()); return; }
        if (video.current) { video.current.srcObject = stream; await video.current.play(); }
        const scan = async () => { if (stopped) return; try { if (video.current?.readyState === 4) { const codes = await detector.detect(video.current); if (codes[0]?.rawValue) { read.current(codes[0].rawValue); return; } } } catch { /* Retry detection on the next video frame. */ } if (!stopped) timer = setTimeout(scan, 300); };
        await scan();
      } catch { if (!stopped) setError("Không mở được camera. Hãy cấp quyền camera hoặc nhập mã thủ công."); }
    };
    void start();
    return () => { stopped = true; clearTimeout(timer); stream?.getTracks().forEach(track => track.stop()); };
  }, [open]);
  return <Drawer open={open} onClose={onClose} title="Quét mã QR" description="Đưa mã của giảng viên vào khung hình."><div className="p-6">{error ? <EmptyState title="Sử dụng mã nhập tay" description={error} kind="search" action={<ActionButton variant="secondary" onClick={onClose}>Quay lại nhập mã</ActionButton>} /> : <div className="relative overflow-hidden rounded-2xl bg-slate-950"><video ref={video} playsInline muted className="min-h-[300px] w-full object-cover" /><div className="pointer-events-none absolute inset-10 rounded-xl border-2 border-white/60" /></div>}</div></Drawer>;
}
function Attendance() {
  const { user } = useSession(); usePortalData();
  const toast = useToast(), [date, setDate] = useState(getLocalDateKey()), [token, setToken] = useState(""), [message, setMessage] = useState<{ text: string; ok: boolean; duplicate?: boolean } | null>(null), [camera, setCamera] = useState(false), [search, setSearch] = useState(""), [history, setHistory] = useState("");
  if (!user) return null;
  const courses = getClassesForStudent(user.studentId), filtered = courses.filter(course => (course.name + course.code).toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi")));
  const submit = (value = token) => {
    if (!/^[A-F0-9]{16}$/i.test(value.trim())) { setMessage({ text: "Nhập đủ mã 16 ký tự được hiển thị bởi giảng viên.", ok: false }); return; }
    try { const result = markPresentWithQr(value, user.studentId ?? ""); setMessage({ text: result.message, ok: result.ok, duplicate: result.ok ? result.duplicate : false }); if (result.ok) { setDate(result.date); toast(result.message, result.duplicate ? "info" : "success"); } } catch { setMessage({ text: "Không ghi nhận được điểm danh. Vui lòng thử lại.", ok: false }); }
  };
  const labels: Record<AttendanceStatus, string> = { present: "Có mặt", absent: "Vắng", excused: "Có phép" };
  const present = courses.filter(course => getClassAttendance(course.id, date)[user.studentId ?? ""] === "present").length;
  return <PortalSubpage title="Điểm danh của tôi" description="Xác nhận tham gia buổi học và theo dõi chuyên cần theo từng học phần."><div className="plt-stack"><section className="plt-qr-panel"><div><span className="plt-eyebrow">SẴN SÀNG CHO BUỔI HỌC</span><h2>Chạm vào một buổi học mới</h2><p>Quét QR hoặc nhập mã 16 ký tự từ giảng viên. Mỗi buổi học chỉ ghi nhận một kết quả có mặt.</p><form className="mt-5 flex flex-wrap gap-2" onSubmit={e => { e.preventDefault(); submit(); }}><input aria-label="Mã QR" className="plt-input min-w-0 flex-1 font-mono tracking-widest" style={{ width: 230 }} placeholder="Mã QR 16 ký tự" autoComplete="off" maxLength={16} value={token} onChange={e => { setToken(e.target.value.toUpperCase().replace(/\s/g, "")); setMessage(null); }} required /><ActionButton type="submit" success={Boolean(message?.ok)}><ClipboardCheck size={15} />Xác nhận</ActionButton></form><button type="button" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#49439c]" onClick={() => setCamera(true)}><Camera size={15} />Quét bằng camera</button>{message && <div role={message.ok ? "status" : "alert"} className={`mt-4 rounded-xl border p-3 text-xs leading-6 ${message.ok ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-rose-100 bg-rose-50 text-rose-700"}`}>{message.ok && <CheckCircle2 size={14} className="mr-2 inline" />}{message.text}</div>}</div><div className="plt-qr-placeholder hidden sm:block"><QrCode size={94} strokeWidth={1} /></div></section><section className="plt-panel"><div className="plt-panel-heading"><div><span className="plt-eyebrow">CHUYÊN CẦN THEO NGÀY</span><h2>Kết quả buổi học</h2></div><span className="plt-pill plt-pill-success">Có mặt {present}/{courses.length}</span></div><div className="plt-toolbar"><label className="plt-search"><Search size={16} /><input aria-label="Tìm học phần điểm danh" placeholder="Tìm học phần…" value={search} onChange={e => setSearch(e.target.value)} /></label><label className="plt-field"><input type="date" aria-label="Ngày xem điểm danh" value={date} onChange={e => { if (e.target.value) setDate(e.target.value); }} /></label></div><div className="space-y-3">{filtered.map(course => { const status = getClassAttendance(course.id, date)[user.studentId ?? ""], summary = getAbsenceSummary(course.id).find(row => row.studentId === user.studentId); return <article key={course.id} className="plt-lesson" style={{ "--course-color": courseColor(course.id) } as React.CSSProperties}><div className="flex items-start justify-between gap-3"><div><span className="plt-lesson-time">{course.code} · {course.startTime}–{course.endTime}</span><h3>{course.name}</h3><p className="mt-2 text-[10px] text-slate-400">{formatDate(date)} · Phòng {course.room}</p></div><span className={`plt-pill ${status === "present" ? "plt-pill-success" : status === "absent" ? "plt-pill-danger" : status === "excused" ? "plt-pill-warning" : "plt-pill-neutral"}`}>{status ? labels[status] : "Chưa điểm danh"}</span></div>{summary?.warning && <p className="mt-3 text-xs text-rose-600">Cần chú ý: đã đạt {summary.percentage}% tiết vắng theo cấu hình học phần.</p>}<div className="mt-4 flex flex-wrap items-center gap-4"><div className="min-w-[100px] flex-1"><Progress value={summary?.rate ?? 0} tone={summary?.warning ? "warning" : "brand"} /></div><span className="text-[10px] text-slate-400">{summary?.present ?? 0}/{summary?.total ?? 0} tiết có mặt</span><button className="text-[10px] font-semibold text-[#49439c]" onClick={() => setHistory(course.id)}>Xem lịch sử</button></div></article>; })}</div>{!filtered.length && <EmptyState title="Chưa có học phần phù hợp" description="Các học phần đã đăng ký sẽ xuất hiện tại đây." kind="calendar" />}</section><p className="plt-info-strip"><Info size={14} />Bản demo lưu điểm danh trên trình duyệt hiện tại. Phiên QR chưa được đồng bộ giữa thiết bị giảng viên và sinh viên.</p></div><CameraScanner open={camera} onClose={() => setCamera(false)} onRead={value => { setToken(value.toUpperCase()); setCamera(false); submit(value); }} /><Drawer open={Boolean(history)} title="Lịch sử chuyên cần" description={courses.find(course => course.id === history)?.name} onClose={() => setHistory("")}><div className="p-6"><div className="plt-timeline">{getAttendanceDays(history).slice().reverse().map(day => { const status = day.records[user.studentId ?? ""]; return <article className="plt-timeline-entry plt-panel" key={day.date}><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold">{formatDate(day.date)}</span><span className={`plt-pill ${status === "present" ? "plt-pill-success" : status === "absent" ? "plt-pill-danger" : "plt-pill-neutral"}`}>{status ? labels[status] : "Chưa ghi nhận"}</span></div><p className="mt-2 text-[11px] text-slate-400">{day.periods} tiết học</p></article>; })}</div>{!getAttendanceDays(history).length && <EmptyState title="Chưa có buổi điểm danh" description="Lịch sử sẽ xuất hiện sau khi giảng viên mở buổi học đầu tiên." kind="calendar" />}</div></Drawer></PortalSubpage>;
}
export function StudentAttendance() { return <RoleGate role="student"><Attendance /></RoleGate>; }
