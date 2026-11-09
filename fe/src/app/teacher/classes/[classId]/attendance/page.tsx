"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, Check, CheckCheck, ClipboardCheck, QrCode, Save } from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import { PortalSubpage } from "@/components/dashboard/PortalSubpage";
import { getCurrentUser, type AppUser } from "@/lib/auth";
import { QrCode as QrImage } from "@/components/dashboard/QrCode";
import { exportAttendanceXlsx } from "@/lib/exportAttendanceXlsx";
import { createQrAttendanceSession, getClassAttendance, getClassRoster, getLocalDateKey, getPortalClass, getClassesForTeacher, saveClassAttendance, type AttendanceStatus, type QrAttendanceSession } from "@/lib/portalData";

const statusOptions: { value: AttendanceStatus; label: string; active: string }[] = [
  { value: "present", label: "Có mặt", active: "bg-emerald-600 text-white" },
  { value: "absent", label: "Vắng", active: "bg-rose-600 text-white" },
  { value: "excused", label: "Có phép", active: "bg-amber-500 text-white" },
];

export default function ClassAttendancePage() {
  const params = useParams<{ classId: string }>();
  const classId = decodeURIComponent(params.classId);
  const course = getPortalClass(classId);
  const roster = useMemo(() => getClassRoster(classId), [classId]);
  const [teacher, setTeacher] = useState<AppUser | null>(null);
  const [date, setDate] = useState("");
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [savedMessage, setSavedMessage] = useState("");
  const [qrSession, setQrSession] = useState<QrAttendanceSession | null>(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (current?.role === "teacher") setTeacher(current);
    setDate(getLocalDateKey());
  }, []);

  useEffect(() => {
    if (date) setMarks(getClassAttendance(classId, date));
  }, [classId, date]);

  const canManage = Boolean(course && teacher && getClassesForTeacher(teacher.id).some((item) => item.id === course.id));
  const presentCount = roster.filter((student) => marks[student.id] === "present").length;
  const absentCount = roster.filter((student) => marks[student.id] === "absent").length;
  const excusedCount = roster.filter((student) => marks[student.id] === "excused").length;
  const unmarkedCount = roster.length - presentCount - absentCount - excusedCount;

  const setAllPresent = () => {
    setMarks(Object.fromEntries(roster.map((student) => [student.id, "present" as const])));
    setSavedMessage("");
  };

  const save = () => {
    if (!date || !course) return;
    saveClassAttendance(course.id, date, marks);
    setSavedMessage("Đã lưu điểm danh cho lớp.");
  };

  const download = () => {
    if (!course) return;
    exportAttendanceXlsx(course.name, course.code, date, roster.map((student) => ({ ...student, status: marks[student.id] })));
  };

  if (!course) {
    return <RoleGate role="teacher"><PortalSubpage title="Không tìm thấy lớp" description="Mã lớp không tồn tại." backHref="/teacher/classes"><p className="rounded-xl bg-white p-5 text-sm text-slate-600">Kiểm tra lại đường dẫn lớp học.</p></PortalSubpage></RoleGate>;
  }

  if (teacher && !canManage) {
    return <RoleGate role="teacher"><PortalSubpage title="Không có quyền truy cập" description="Lớp này không nằm trong danh sách được phân công." backHref="/teacher/classes"><p className="rounded-xl bg-white p-5 text-sm text-slate-600">Chọn một lớp trong danh sách lớp phụ trách.</p></PortalSubpage></RoleGate>;
  }

  return (
    <RoleGate role="teacher">
      <PortalSubpage title={`Điểm danh · ${course.name}`} description={`${course.code} · ${course.weekday}, ${course.startTime}–${course.endTime} · Phòng ${course.room}`} backHref="/teacher/classes" actions={<button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50"><ArrowDownToLine className="h-4 w-4" />Xuất Excel</button>}>
        <div className="space-y-4">
          <section className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <label className="text-xs font-semibold text-slate-600">Ngày điểm danh<input type="date" value={date} onChange={(event) => { setDate(event.target.value); setSavedMessage(""); }} className="mt-2 block rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
            <div className="flex flex-wrap gap-2 text-xs"><span className="rounded-lg bg-emerald-50 px-3 py-2 font-semibold text-emerald-800">Có mặt: {presentCount}</span><span className="rounded-lg bg-rose-50 px-3 py-2 font-semibold text-rose-800">Vắng: {absentCount}</span><span className="rounded-lg bg-amber-50 px-3 py-2 font-semibold text-amber-800">Có phép: {excusedCount}</span><span className="rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-600">Chưa điểm danh: {unmarkedCount}</span></div>
          </section>

          <section className="grid gap-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-700">Điểm danh nhanh</p><h2 className="mt-1 text-lg font-bold">Mã QR buổi học · hiệu lực 10 phút</h2><p className="mt-1 text-sm text-slate-500">Sinh viên nhập mã hiển thị sau khi quét QR.</p>{qrSession ? <p className="mt-3 font-mono font-bold tracking-widest">{qrSession.token}</p> : null}<button type="button" onClick={() => setQrSession(createQrAttendanceSession(course.id, date))} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#0d4d90] px-4 py-2.5 text-sm font-semibold text-white"><QrCode className="h-4 w-4" />Tạo mã QR</button></div>{qrSession ? <QrImage value={qrSession.token} size={184} /> : <QrCode className="mx-auto h-16 w-16 text-blue-200" />}</section>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_3px_14px_rgba(15,23,42,0.03)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5"><div><h2 className="text-base font-bold text-slate-900">Danh sách sinh viên</h2><p className="mt-1 text-xs text-slate-500">{roster.length} sinh viên trong lớp</p></div><button type="button" onClick={setAllPresent} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"><CheckCheck className="h-4 w-4" />Đánh dấu tất cả có mặt</button></div>
            <div className="divide-y divide-slate-100 md:hidden">{roster.map((student, index) => <div key={student.id} className="space-y-3 p-4"><div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-800">{index + 1}</span><div className="min-w-0"><p className="text-sm font-semibold text-slate-800">{student.fullName}</p><p className="mt-0.5 text-xs text-slate-500">{student.studentId}</p></div></div><StatusButtons current={marks[student.id]} onChange={(status) => { setMarks((current) => ({ ...current, [student.id]: status })); setSavedMessage(""); }} /></div>)}</div>
            <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-[10px] uppercase tracking-[0.08em] text-slate-500"><tr><th className="px-5 py-3 font-semibold">STT</th><th className="px-5 py-3 font-semibold">Mã sinh viên</th><th className="px-5 py-3 font-semibold">Họ và tên</th><th className="px-5 py-3 font-semibold">Email</th><th className="px-5 py-3 font-semibold">Trạng thái</th></tr></thead><tbody className="divide-y divide-slate-100">{roster.map((student, index) => <tr key={student.id} className="hover:bg-slate-50/70"><td className="px-5 py-3 text-xs text-slate-500">{index + 1}</td><td className="px-5 py-3 text-xs font-medium text-slate-600">{student.studentId}</td><td className="px-5 py-3 text-sm font-semibold text-slate-800">{student.fullName}</td><td className="px-5 py-3 text-xs text-slate-500">{student.email}</td><td className="px-5 py-3"><StatusButtons current={marks[student.id]} onChange={(status) => { setMarks((current) => ({ ...current, [student.id]: status })); setSavedMessage(""); }} /></td></tr>)}</tbody></table></div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-5"><p aria-live="polite" className="text-xs text-emerald-700">{savedMessage || "Điểm danh sẽ được lưu trên thiết bị này."}</p><button type="button" onClick={save} disabled={!date} className="inline-flex items-center gap-2 rounded-xl bg-[#0d4d90] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#093b70] disabled:opacity-50"><Save className="h-4 w-4" />Lưu điểm danh</button></div>
          </section>
          <p className="flex items-center gap-2 text-[11px] text-slate-400"><ClipboardCheck className="h-3.5 w-3.5" />Dữ liệu điểm danh hiện lưu trên trình duyệt. Xuất Excel tải xuống bảng theo lớp và ngày đã chọn.</p>
        </div>
      </PortalSubpage>
    </RoleGate>
  );
}

function StatusButtons({ current, onChange }: { current?: AttendanceStatus; onChange: (status: AttendanceStatus) => void }) {
  return <div className="flex flex-wrap gap-1.5">{statusOptions.map((option) => <button key={option.value} type="button" aria-pressed={current === option.value} onClick={() => onChange(option.value)} className={`attendance-choice inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${current === option.value ? option.active : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}>{current === option.value ? <Check className="h-3 w-3" /> : null}{option.label}</button>)}</div>;
}
