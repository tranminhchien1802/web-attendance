import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import type { PortalClass } from "@/lib/portalData";
import { courseColor, courseImage } from "@/lib/presentation";
export function CourseCard({ course, teacher = false }: { course: PortalClass; teacher?: boolean }) {
  const color = courseColor(course.id);
  return <article className="plt-course-card" style={{ "--course-color": color } as React.CSSProperties}><div className="plt-course-cover"><Image src={courseImage(course.id)} alt="" fill sizes="(min-width:1280px) 28vw, (min-width:640px) 45vw, 90vw" className="object-cover" /><span className="plt-course-overlay" /><span className="plt-course-code">{course.code}</span><span className="plt-course-type">{course.type}</span></div><div className="plt-course-body"><p className="plt-course-faculty">{course.faculty}</p><h3>{course.name}</h3><div className="plt-course-meta"><span><CalendarDays size={14} />{course.weekday} · {course.startTime}–{course.endTime}</span><span><MapPin size={14} />Phòng {course.room}</span><span><Users size={14} />{course.studentIds.length} sinh viên</span></div><Link className="plt-course-link" href={teacher ? `/teacher/classes/${course.id}/attendance` : "/student/attendance"}>{teacher ? "Mở điểm danh" : "Xem điểm danh"}<ArrowUpRight size={17} /></Link></div></article>;
}
