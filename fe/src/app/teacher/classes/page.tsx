"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, ClipboardCheck, MapPin, Users } from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import { PortalSubpage } from "@/components/dashboard/PortalSubpage";
import { getCurrentUser, type AppUser } from "@/lib/auth";
import { getClassesForTeacher } from "@/lib/portalData";

export default function TeacherClassesPage() {
  const [teacher, setTeacher] = useState<AppUser | null>(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (current?.role === "teacher") setTeacher(current);
  }, []);

  const classes = teacher ? getClassesForTeacher(teacher.id) : [];

  return (
    <RoleGate role="teacher">
      <PortalSubpage title="Lớp phụ trách" description="Chọn lớp để mở danh sách sinh viên và ghi nhận điểm danh." backHref="/teacher/Index">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((course) => (
            <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_3px_14px_rgba(15,23,42,0.03)]">
              <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700">{course.code}</p><h2 className="mt-1 text-lg font-bold text-slate-900">{course.name}</h2></div><span className="rounded-xl bg-blue-50 p-2.5 text-blue-700"><Users className="h-5 w-5" /></span></div>
              <div className="mt-5 space-y-2 text-xs text-slate-500"><p className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />{course.studentIds.length} sinh viên</p><p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />{course.weekday} · {course.startTime}–{course.endTime}</p><p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />Phòng {course.room} · {course.type}</p></div><p className="flex items-center gap-2 text-[11px] font-medium text-blue-700"><span className="rounded-full bg-blue-50 px-2 py-1">{course.faculty}</span><span>{course.major}</span></p>
              <Link href={`/teacher/classes/${course.id}/attendance`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d4d90] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#093b70]"><ClipboardCheck className="h-4 w-4" />Mở điểm danh</Link>
            </article>
          ))}
          {!classes.length ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Chưa có lớp được phân công cho tài khoản này.</div> : null}
        </div>
      </PortalSubpage>
    </RoleGate>
  );
}
