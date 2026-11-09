"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, CircleAlert, Clock3, QrCode } from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import { PortalSubpage } from "@/components/dashboard/PortalSubpage";
import { getCurrentUser, type AppUser } from "@/lib/auth";
import { getClassAttendance, getClassesForStudent, getLocalDateKey, markPresentWithQr, type AttendanceStatus } from "@/lib/portalData";

const statusText: Record<AttendanceStatus, string> = { present: "Có mặt", absent: "Vắng", excused: "Có phép" };
const statusStyles: Record<AttendanceStatus, string> = { present: "bg-emerald-50 text-emerald-700", absent: "bg-rose-50 text-rose-700", excused: "bg-amber-50 text-amber-700" };

export default function StudentAttendancePage() {
  const [student, setStudent] = useState<AppUser | null>(null);
  const [date, setDate] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [qrMessage, setQrMessage] = useState("");

  useEffect(() => {
    const current = getCurrentUser();
    if (current?.role === "student") setStudent(current);
    setDate(getLocalDateKey());
  }, []);

  const courses = student ? getClassesForStudent(student.studentId) : [];
  const rows = courses.map((course) => ({ course, status: student && date ? getClassAttendance(course.id, date)[student.studentId ?? ""] : undefined }));
  const presentCount = rows.filter((row) => row.status === "present").length;
  const markedCount = rows.filter((row) => Boolean(row.status)).length;

  return (
    <RoleGate role="student">
      <PortalSubpage title="Điểm danh của tôi" description="Trạng thái điểm danh được cập nhật bởi giảng viên của từng lớp." backHref="/student/Index">
        <section className="mb-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4 shadow-sm"><div className="flex items-center gap-2 font-bold text-blue-900"><QrCode className="h-5 w-5" />Điểm danh bằng QR</div><p className="mt-1 text-xs text-slate-500">Quét mã của giảng viên bằng camera điện thoại, sau đó nhập mã 16 ký tự tại đây.</p><div className="mt-3 flex flex-wrap gap-2"><input value={qrCode} maxLength={16} onChange={(event) => setQrCode(event.target.value.toUpperCase())} placeholder="Mã QR" className="w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono tracking-widest" /><button type="button" onClick={() => { if (!student?.studentId) return; const result = markPresentWithQr(qrCode, student.studentId); setQrMessage(result.message); setDate(getLocalDateKey()); }} className="rounded-lg bg-[#0d4d90] px-4 py-2 text-sm font-semibold text-white">Xác nhận</button></div>{qrMessage ? <p aria-live="polite" className="mt-2 text-xs font-semibold text-emerald-700">{qrMessage}</p> : null}</section>
        <section className="mb-4 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <label className="text-xs font-semibold text-slate-600">Ngày xem<input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 block rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
          <div className="flex gap-2 text-xs"><span className="rounded-lg bg-emerald-50 px-3 py-2 font-semibold text-emerald-800">Có mặt: {presentCount}</span><span className="rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-600">Đã cập nhật: {markedCount}/{courses.length}</span></div>
        </section>
        <div className="grid gap-3">{rows.map(({ course, status }) => <article key={course.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex min-w-0 items-start gap-3"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status === "present" ? "bg-emerald-50 text-emerald-700" : status === "absent" ? "bg-rose-50 text-rose-700" : status === "excused" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{status === "present" ? <CheckCircle2 className="h-5 w-5" /> : status ? <CircleAlert className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}</span><div className="min-w-0"><p className="text-sm font-bold text-slate-800">{course.name}</p><p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500"><span>{course.code}</span><span>·</span><span>{course.weekday}, {course.startTime}–{course.endTime}</span><span>·</span><span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{course.room}</span></p></div></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status ? statusStyles[status] : "bg-slate-100 text-slate-500"}`}>{status ? statusText[status] : "Chưa cập nhật"}</span></article>)}{!rows.length ? <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Tài khoản chưa có lớp đăng ký.</p> : null}</div>
        <p aria-live="polite" className="mt-4 text-[11px] text-slate-400">Trạng thái được lưu sau khi giảng viên hoàn tất điểm danh.</p>
      </PortalSubpage>
    </RoleGate>
  );
}
