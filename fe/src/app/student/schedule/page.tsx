"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import { PortalSubpage } from "@/components/dashboard/PortalSubpage";
import { getCurrentUser, type AppUser } from "@/lib/auth";
import { getClassesForStudent } from "@/lib/portalData";

const weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export default function StudentSchedulePage() {
  const [student, setStudent] = useState<AppUser | null>(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (current?.role === "student") setStudent(current);
  }, []);

  const classes = student ? getClassesForStudent(student.studentId) : [];

  return (
    <RoleGate role="student">
      <PortalSubpage title="Thời khóa biểu" description="Lịch học và các lớp đã đăng ký trong học kỳ hiện tại." backHref="/student/Index">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {weekdays.map((day) => {
            const lessons = classes.filter((course) => course.weekday === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
            return <section key={day} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)]"><h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold text-slate-800"><CalendarDays className="h-4 w-4 text-blue-700" />{day}</h2>{lessons.length ? <div className="mt-3 space-y-3">{lessons.map((course) => <article key={course.id} className="rounded-xl bg-blue-50/70 p-3"><p className="text-xs font-bold text-blue-800">{course.startTime} – {course.endTime}</p><p className="mt-1 text-sm font-semibold text-slate-800">{course.name}</p><p className="mt-1 text-[11px] text-slate-500">{course.code} · {course.type}</p><p className="mt-2 inline-flex items-center gap-1 text-[10px] text-slate-500"><MapPin className="h-3 w-3" />Phòng {course.room}</p></article>)}</div> : <p className="py-5 text-xs text-slate-400">Không có lịch học.</p>}</section>;
          })}
        </div>
      </PortalSubpage>
    </RoleGate>
  );
}
