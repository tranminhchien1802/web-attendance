"use client";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, Search, Users } from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import { useSession } from "@/components/auth/SessionProvider";
import { ActionButton, EmptyState } from "@/components/ui/PortalUI";
import { getClassesForStudent, getClassesForTeacher, getLocalDateKey } from "@/lib/portalData";
import { courseColor, formatDate } from "@/lib/presentation";
import { PortalSubpage } from "./PortalSubpage";
const weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
function ScheduleContent({ teacher }: { teacher: boolean }) {
  const { user } = useSession();
  const [search, setSearch] = useState(""), [week, setWeek] = useState(0);
  if (!user) return null;
  const courses = teacher ? getClassesForTeacher(user.id, user.userCode) : getClassesForStudent(user.studentId);
  const selected = courses.filter(course => (course.name + course.code).toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi")));
  const monday = new Date(); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + week * 7);
  const saturday = new Date(monday); saturday.setDate(monday.getDate() + 5);
  const today = new Date().getDay();
  return <PortalSubpage title={teacher ? "Lịch giảng dạy" : "Lịch học của bạn"} description="Kế hoạch các học phần trong tuần. Màu học phần được giữ thống nhất giữa các màn hình."><div className="plt-panel mb-5"><div className="plt-toolbar mb-0"><label className="plt-search"><Search size={16} /><input value={search} aria-label="Tìm trong lịch" onChange={e => setSearch(e.target.value)} placeholder="Tên hoặc mã học phần…" /></label><div className="flex items-center gap-2"><ActionButton variant="secondary" aria-label="Tuần trước" onClick={() => setWeek(old => old - 1)}><ChevronLeft size={15} /></ActionButton><span className="px-2 text-[11px] text-slate-500">{formatDate(getLocalDateKey(monday))} – {formatDate(getLocalDateKey(saturday))}</span><ActionButton variant="secondary" aria-label="Tuần sau" onClick={() => setWeek(old => old + 1)}><ChevronRight size={15} /></ActionButton></div><ActionButton variant="secondary" onClick={() => setWeek(0)}>Tuần này</ActionButton></div></div><div className="plt-chip-list">{selected.map(course => <span key={course.id} className="plt-chip" style={{ background: courseColor(course.id) + "0d", borderColor: courseColor(course.id) + "25", color: courseColor(course.id) }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: courseColor(course.id) }} />{course.code}</span>)}</div>{courses.length ? <div className="plt-schedule-grid">{weekdays.map((day, index) => { const lessons = selected.filter(course => course.weekday === day).sort((a, b) => a.startTime.localeCompare(b.startTime)); const date = new Date(monday); date.setDate(monday.getDate() + index); return <section key={day} className={`plt-schedule-day ${week === 0 && today === index + 1 ? "is-today" : ""}`}><header><span>{day}</span><span className="text-[10px] font-normal text-slate-400">{date.getDate()}/{date.getMonth() + 1}{week === 0 && today === index + 1 ? " · Hôm nay" : ""}</span></header>{lessons.length ? lessons.map(course => <article className="plt-lesson" key={course.id} style={{ "--course-color": courseColor(course.id) } as React.CSSProperties}><div className="plt-lesson-time">{course.startTime} – {course.endTime}</div><h3>{course.name}</h3><div className="plt-lesson-meta"><span>{course.code}</span><span>{course.type}</span><span><MapPin size={11} className="inline" /> {course.room}</span>{teacher && <span><Users size={11} className="inline" /> {course.studentIds.length} sinh viên</span>}</div></article>) : <div className="plt-schedule-day-empty"><CalendarDays size={15} />Không có lịch học</div>}</section>; })}</div> : <div className="plt-panel"><EmptyState kind="calendar" title="Tuần học đang chờ bạn" description="Các lớp được phân công hoặc đăng ký sẽ xuất hiện trong lịch học." /></div>}<p className="plt-info-strip mt-4"><CalendarDays size={13} />Lịch tuần lặp lại theo các học phần trong học kỳ.</p></PortalSubpage>;
}
export function ScheduleView({ teacher = false }: { teacher?: boolean }) { return <RoleGate role={teacher ? "teacher" : "student"}><ScheduleContent teacher={teacher} /></RoleGate>; }
