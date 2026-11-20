"use client";
import { useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { RoleGate } from "@/components/RoleGate";
import { useSession } from "@/components/auth/SessionProvider";
import { EmptyState } from "@/components/ui/PortalUI";
import { PortalSubpage } from "@/components/dashboard/PortalSubpage";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { getClassesForTeacher } from "@/lib/portalData";
function Classes() {
  const { user } = useSession();
  const [search, setSearch] = useState(""), [faculty, setFaculty] = useState("all");
  if (!user) return null;
  const courses = getClassesForTeacher(user.id, user.userCode), faculties = Array.from(new Set(courses.map(course => course.faculty)));
  const filtered = courses.filter(course => (course.name + course.code).toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi")) && (faculty === "all" || course.faculty === faculty));
  return <PortalSubpage title="Lớp phụ trách" description="Mỗi học phần, một không gian để kết nối và theo dõi tiến trình học tập."><div className="plt-toolbar"><label className="plt-search"><Search size={16} /><input aria-label="Tìm lớp học" placeholder="Tên hoặc mã học phần…" value={search} onChange={e => setSearch(e.target.value)} /></label><select aria-label="Lọc khoa" className="plt-input" style={{ width: 240 }} value={faculty} onChange={e => setFaculty(e.target.value)}><option value="all">Tất cả các khoa</option>{faculties.map(item => <option key={item}>{item}</option>)}</select><span className="plt-count-label flex items-center gap-2"><BookOpen size={14} />{filtered.length} học phần</span></div><div className="plt-course-grid">{filtered.map(course => <CourseCard key={course.id} course={course} teacher />)}</div>{!filtered.length && <div className="plt-panel"><EmptyState title={search || faculty !== "all" ? "Không tìm thấy lớp phù hợp" : "Chưa có lớp được phân công"} description="Kiểm tra bộ lọc hoặc liên hệ quản trị viên để cập nhật danh sách lớp." kind="search" /></div>}</PortalSubpage>;
}
export default function TeacherClassesPage() { return <RoleGate role="teacher"><Classes /></RoleGate>; }
