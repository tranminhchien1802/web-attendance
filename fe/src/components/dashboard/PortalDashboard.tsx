"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquareText,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { getCurrentUser, getUsers, logoutUser, updateUserRole, type AppUser, type UserRole } from "@/lib/auth";
import { getClassesForTeacher } from "@/lib/portalData";

type NavigationItem = { label: string; icon: LucideIcon; href: string };
type StatItem = { label: string; value: string; note: string; icon: LucideIcon; tone: string };

const roleLabels: Record<UserRole, string> = {
  student: "Sinh viên",
  teacher: "Giảng viên",
  admin: "Quản trị viên",
};

const navigation: Record<UserRole, NavigationItem[]> = {
  student: [
    { label: "Tổng quan", icon: LayoutDashboard, href: "/student/Index#overview" },
    { label: "Thông báo", icon: MessageSquareText, href: "/student/Index#announcements" },
    { label: "Lịch học", icon: CalendarDays, href: "/student/schedule" },
    { label: "Điểm danh", icon: ClipboardCheck, href: "/student/attendance" },
    { label: "Kết quả học tập", icon: Award, href: "/student/Index#results" },
    { label: "Học phí", icon: WalletCards, href: "/student/Index#tuition" },
    { label: "Hồ sơ cá nhân", icon: UserRound, href: "/student/Index#profile" },
  ],
  teacher: [
    { label: "Tổng quan", icon: LayoutDashboard, href: "/teacher/Index#overview" },
    { label: "Lịch giảng dạy", icon: CalendarDays, href: "/teacher/schedule" },
    { label: "Lớp phụ trách", icon: BookOpen, href: "/teacher/classes" },
    { label: "Nhật ký · Vắng · Điểm", icon: BookOpen, href: "/teacher/tools" },
    { label: "Điểm danh", icon: ClipboardCheck, href: "/teacher/classes" },
    { label: "Việc cần xử lý", icon: FileCheck2, href: "/teacher/Index#tasks" },
    { label: "Thông tin cá nhân", icon: UserRound, href: "/teacher/Index#profile" },
  ],
  admin: [
    { label: "Tổng quan", icon: LayoutDashboard, href: "#overview" },
    { label: "Tài khoản", icon: Users, href: "#accounts" },
    { label: "Thông tin cá nhân", icon: UserRound, href: "#profile" },
  ],
};

const studentStats: StatItem[] = [
  { label: "Tín chỉ đã hoàn thành", value: "96 / 140", note: "+6 tín chỉ kỳ vừa rồi", icon: BookOpen, tone: "blue" },
  { label: "Điểm trung bình", value: "3.42", note: "Xếp loại Khá", icon: Award, tone: "green" },
  { label: "Tỷ lệ chuyên cần", value: "96%", note: "Trong học kỳ hiện tại", icon: CheckCircle2, tone: "violet" },
  { label: "Học phí cần đóng", value: "4,2 triệu", note: "Hạn thanh toán 20/11", icon: CircleDollarSign, tone: "amber" },
];

const teacherStats: StatItem[] = [
  { label: "Lớp đang phụ trách", value: "08", note: "Trong học kỳ hiện tại", icon: BookOpen, tone: "blue" },
  { label: "Sinh viên", value: "420", note: "Tổng số trong các lớp", icon: Users, tone: "green" },
  { label: "Bài cần chấm", value: "18", note: "Có 6 bài sắp đến hạn", icon: FileCheck2, tone: "amber" },
  { label: "Tỷ lệ điểm danh", value: "96%", note: "Đã cập nhật tuần này", icon: ClipboardCheck, tone: "violet" },
];

const studentSchedule = [
  { day: "Thứ 2", time: "07:30 – 09:00", subject: "Lập trình Web", room: "A1.302", type: "Lý thuyết" },
  { day: "Thứ 2", time: "09:15 – 10:45", subject: "Cơ sở dữ liệu", room: "B2.204", type: "Thực hành" },
  { day: "Thứ 3", time: "13:30 – 15:00", subject: "Trí tuệ nhân tạo", room: "C3.105", type: "Seminar" },
  { day: "Thứ 4", time: "07:30 – 09:00", subject: "Mạng máy tính", room: "D4.101", type: "Lý thuyết" },
  { day: "Thứ 5", time: "13:30 – 15:00", subject: "Phân tích thiết kế phần mềm", room: "E5.210", type: "Lý thuyết" },
  { day: "Thứ 6", time: "07:30 – 09:00", subject: "Tiếng Anh chuyên ngành", room: "F6.110", type: "Học phần" },
];

const notices = [
  { title: "Lịch đăng ký học phần học kỳ mới", sender: "Phòng Đào tạo", date: "Hôm nay · 08:30", tag: "Học vụ", unread: true },
  { title: "Cập nhật lịch kiểm tra giữa kỳ", sender: "Bộ phận đào tạo", date: "Hôm qua · 15:20", tag: "Lịch học", unread: true },
  { title: "Hướng dẫn hoàn tất học phí học kỳ", sender: "Phòng Tài chính", date: "03/11/2026 · 09:00", tag: "Học phí", unread: false },
];

const studentAttendance = [
  { subject: "Lập trình Web", present: 19, total: 20, percent: 95 },
  { subject: "Cơ sở dữ liệu", present: 23, total: 24, percent: 96 },
  { subject: "Mạng máy tính", present: 16, total: 17, percent: 94 },
];

const results = [
  { subject: "Lập trình Web", credits: 3, score: "3.8", grade: "A" },
  { subject: "Cơ sở dữ liệu", credits: 3, score: "3.6", grade: "B+" },
  { subject: "Trí tuệ nhân tạo", credits: 3, score: "3.7", grade: "A" },
  { subject: "Tiếng Anh chuyên ngành", credits: 2, score: "3.5", grade: "B+" },
];

const tuitionItems = [
  { title: "Học phí học kỳ 2026-1", amount: "6.800.000đ", status: "Đã thanh toán" },
  { title: "Học phí học kỳ 2026-2", amount: "4.200.000đ", status: "Cần thanh toán" },
  { title: "Phí bảo hiểm", amount: "1.200.000đ", status: "Đã thanh toán" },
];

const teacherAttendance = [
  { name: "Lập trình Web 1", present: 40, total: 42, percent: 95 },
  { name: "Cơ sở dữ liệu", present: 36, total: 38, percent: 95 },
  { name: "Phương pháp nghiên cứu", present: 28, total: 30, percent: 93 },
];

const teacherTasks = [
  { title: "Chấm bài thực hành Lab 03", detail: "Lập trình Web 1 · 12 bài", due: "Hạn nộp ngày 07/11", urgent: true },
  { title: "Cập nhật điểm kiểm tra giữa kỳ", detail: "Cơ sở dữ liệu · 38 sinh viên", due: "Hạn cập nhật ngày 10/11", urgent: true },
  { title: "Chuẩn bị nội dung buổi học", detail: "Phương pháp nghiên cứu", due: "Buổi học tiếp theo", urgent: false },
];

const toneClasses: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
};

function StatCard({ label, value, note, icon: Icon, tone }: StatItem) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">{value}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{note}</p>
    </article>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">{eyebrow}</p> : null}
        <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export default function PortalDashboard({ requiredRole }: { requiredRole?: UserRole }) {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [accounts, setAccounts] = useState<AppUser[]>([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("#overview");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    if (requiredRole && currentUser.role !== requiredRole) {
      router.replace(currentUser.role === "student" ? "/student/Index" : currentUser.role === "teacher" ? "/teacher/Index" : "/dashboard");
      return;
    }
    setUser(currentUser);
    setAccounts(getUsers());
  }, [requiredRole, router]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const role = user?.role ?? "student";
  const filteredNotices = useMemo(
    () => notices.filter((notice) => `${notice.title} ${notice.sender} ${notice.tag}`.toLowerCase().includes(search.toLowerCase())),
    [search]
  );
  const filteredClasses = useMemo(
    () => (user ? getClassesForTeacher(user.id) : []).map((course) => ({
      name: course.name,
      code: course.code,
      students: course.studentIds.length,
      next: `${course.weekday}, ${course.startTime}`,
    })).filter((item) => `${item.name} ${item.code}`.toLowerCase().includes(search.toLowerCase())),
    [search, user]
  );
  const filteredAccounts = useMemo(
    () => accounts.filter((account) => `${account.fullName} ${account.email} ${roleLabels[account.role]}`.toLowerCase().includes(search.toLowerCase())),
    [accounts, search]
  );

  if (!user) return null;

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const handleRoleUpdate = (targetId: string, nextRole: "student" | "teacher") => {
    updateUserRole(targetId, nextRole);
    setAccounts(getUsers());
  };

  const closeMobileNav = () => setMobileNavOpen(false);

  const renderSidebar = (onNavigate?: () => void) => (
    <>
      <div className="flex items-center gap-3 border-b border-slate-100 px-2 pb-5 pt-1">
        <div className="flex h-12 w-[76px] shrink-0 items-center justify-center rounded-lg bg-white px-2">
          <Image src="/images/logo.png" alt="Logo công ty" width={720} height={424} className="h-9 w-auto object-contain" priority />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-blue-700">Cổng đào tạo</p>
          <p className="mt-1 text-xs font-bold leading-4 text-slate-800">Công ty TNHH<br />Phan Gia Phước</p>
        </div>
      </div>

      <div className="my-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
          {user.fullName.split(" ").slice(-2).map((part) => part[0]).join("").toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-800">{user.fullName}</p>
          <p className="mt-0.5 truncate text-[11px] text-slate-500">{roleLabels[user.role]} · {user.studentId || "Tài khoản nội bộ"}</p>
        </div>
      </div>

      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">Danh mục</p>
      <nav aria-label="Điều hướng dashboard" className="space-y-1">
        {navigation[user.role].map(({ label, icon: Icon, href }) => (
          <Link
            key={href}
            href={href}
            onClick={() => {
              setActiveNav(href);
              onNavigate?.();
            }}
            aria-current={activeNav === href ? "page" : undefined}
            className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] transition ${
              activeNav === href
                ? "bg-blue-50 font-semibold text-blue-800"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span className="flex items-center gap-3"><Icon className="h-4 w-4" />{label}</span>
            <ChevronRight className={`h-3.5 w-3.5 transition ${activeNav === href ? "text-blue-700" : "text-slate-300 group-hover:text-slate-500"}`} />
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-100 pt-4">
        <button onClick={handleLogout} type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-700">
          <LogOut className="h-4 w-4" /> Đăng xuất
        </button>
      </div>
    </>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      <section id="overview" className="dashboard-hero relative isolate min-h-[220px] overflow-hidden rounded-2xl bg-[#103d70] bg-cover bg-center shadow-sm sm:min-h-[250px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(13,49,89,.94), rgba(13,49,89,.46)), url(/images/hcmute-campus.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div aria-hidden="true" className="absolute -right-14 -top-28 -z-10 h-80 w-80 rounded-full border-[38px] border-white/[0.06]" />
        <div aria-hidden="true" className="absolute -bottom-32 right-36 -z-10 h-64 w-64 rounded-full bg-cyan-300/[0.08] blur-2xl" />
        <div className="relative flex min-h-[220px] flex-col justify-between gap-7 p-5 text-white sm:min-h-[250px] sm:p-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">Cổng thông tin đào tạo · Sinh viên</p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Chào mừng trở lại, {user.fullName.split(" ").slice(-2).join(" ")}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-50/90">Theo dõi lịch học, kết quả và các thông tin đào tạo của bạn tại một nơi.</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <CalendarClock className="h-5 w-5 text-blue-100" />
            <div><p className="text-[10px] uppercase tracking-[0.12em] text-blue-100">Học kỳ hiện tại</p><p className="mt-1 text-sm font-semibold">Học kỳ 1 · 2026–2027</p></div>
          </div>
        </div>
      </section>

      <section aria-label="Tổng quan học tập" className="dashboard-stagger grid grid-cols-2 gap-3 xl:grid-cols-4">
        {studentStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <article id="announcements" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5">
          <SectionHeading eyebrow="Cập nhật mới" title="Thông báo" action={<Link href="#announcements" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">Tất cả <ChevronRight className="h-3.5 w-3.5" /></Link>} />
          <div className="divide-y divide-slate-100">
            {filteredNotices.map((notice) => (
              <a href="#announcements" key={notice.title} className="flex gap-3 py-3.5 first:pt-1 last:pb-1">
                <span className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${notice.unread ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-500"}`}><Bell className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold text-slate-800">{notice.title}</span>{notice.unread ? <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-label="Chưa đọc" /> : null}</span>
                  <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500"><span>{notice.sender}</span><span className="text-slate-300">·</span><span>{notice.date}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">{notice.tag}</span></span>
                </span>
              </a>
            ))}
            {!filteredNotices.length ? <p className="py-6 text-center text-sm text-slate-500">Không tìm thấy thông báo phù hợp.</p> : null}
          </div>
        </article>

        <article id="schedule" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5">
          <SectionHeading eyebrow="Lịch học" title="Lịch sắp tới" action={<CalendarDays className="h-5 w-5 text-blue-700" />} />
          <div className="space-y-2.5">
            {studentSchedule.slice(0, 3).map((item, index) => (
              <div key={`${item.day}-${item.subject}`} className="flex gap-3 rounded-xl border border-slate-100 p-3">
                <div className="w-[62px] shrink-0 border-r border-slate-100 pr-3 text-center">
                  <p className="text-[10px] font-semibold uppercase text-slate-400">{item.day}</p>
                  <p className="mt-1 text-xs font-bold text-blue-800">{item.time.split(" – ")[0]}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.subject}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500"><MapPin className="h-3 w-3" />{item.room} <span className="text-slate-300">·</span> {item.type}</p>
                </div>
                {index === 0 ? <span className="h-fit rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">Tiếp theo</span> : null}
              </div>
            ))}
          </div>
          <Link href="#weekly-schedule" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">Xem thời khóa biểu tuần <ChevronRight className="h-3.5 w-3.5" /></Link>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article id="attendance" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5">
          <SectionHeading eyebrow="Theo dõi học tập" title="Tình hình điểm danh" action={<span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Chuyên cần tốt</span>} />
          <div className="space-y-4">
            {studentAttendance.map((item) => <div key={item.subject}>
              <div className="mb-2 flex items-center justify-between gap-3"><span className="text-sm font-medium text-slate-700">{item.subject}</span><span className="text-xs font-bold text-slate-700">{item.percent}% <span className="font-normal text-slate-400">· {item.present}/{item.total} buổi</span></span></div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="dashboard-progress h-full rounded-full bg-blue-600" style={{ width: `${item.percent}%` }} /></div>
            </div>)}
          </div>
        </article>

        <article id="results" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5">
          <SectionHeading eyebrow="Bảng điểm" title="Kết quả gần đây" action={<span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-800">GPA 3.42</span>} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-[0.08em] text-slate-400"><th className="pb-2.5 font-semibold">Môn học</th><th className="pb-2.5 font-semibold">Tín chỉ</th><th className="pb-2.5 font-semibold">Điểm</th><th className="pb-2.5 text-right font-semibold">Xếp loại</th></tr></thead>
              <tbody>{results.map((item) => <tr key={item.subject} className="border-b border-slate-50 last:border-0"><td className="py-3 font-medium text-slate-700">{item.subject}</td><td className="py-3 text-slate-500">{item.credits}</td><td className="py-3 font-semibold text-slate-700">{item.score}</td><td className="py-3 text-right"><span className="rounded-md bg-emerald-50 px-2 py-1 font-bold text-emerald-700">{item.grade}</span></td></tr>)}</tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <article id="weekly-schedule" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5">
          <SectionHeading eyebrow="Học kỳ 1 · 2026–2027" title="Thời khóa biểu trong tuần" />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"].map((day) => {
              const lessons = studentSchedule.filter((item) => item.day === day);
              return <div key={day} className="rounded-xl bg-slate-50 p-3">
                <p className="mb-2 border-b border-slate-200 pb-2 text-xs font-bold text-slate-700">{day}</p>
                {lessons.length ? <div className="space-y-2">{lessons.map((item) => <div key={item.subject} className="rounded-lg border border-blue-100 bg-white p-2.5"><p className="text-[10px] font-semibold text-blue-700">{item.time}</p><p className="mt-1 text-xs font-semibold text-slate-800">{item.subject}</p><p className="mt-1 text-[10px] text-slate-500">{item.room} · {item.type}</p></div>)}</div> : <p className="py-2 text-xs text-slate-400">Chưa có lịch học</p>}
              </div>;
            })}
          </div>
        </article>

        <article id="tuition" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5">
          <SectionHeading eyebrow="Tài chính" title="Học phí" action={<WalletCards className="h-5 w-5 text-blue-700" />} />
          <div className="mb-4 rounded-xl bg-[#f1f6fc] p-4">
            <p className="text-xs text-slate-500">Số tiền còn cần thanh toán</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">4.200.000đ</p>
            <p className="mt-1 text-[11px] text-amber-700">Hạn thanh toán: 20/11/2026</p>
          </div>
          <div className="space-y-2.5">{tuitionItems.map((item) => <div key={item.title} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5 last:border-0 last:pb-0"><div><p className="text-xs font-semibold text-slate-700">{item.title}</p><p className="mt-1 text-[11px] text-slate-500">{item.amount}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${item.status === "Cần thanh toán" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{item.status}</span></div>)}</div>
        </article>
      </section>

      <section id="profile" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5">
        <SectionHeading eyebrow="Tài khoản" title="Thông tin sinh viên" />
        <div className="grid gap-4 sm:grid-cols-3"><ProfileField label="Họ và tên" value={user.fullName} /><ProfileField label="Mã sinh viên" value={user.studentId || "Chưa cập nhật"} /><ProfileField label="Email" value={user.email} /><ProfileField label="Khoa" value={user.faculty || user.department || "Chưa cập nhật"} /><ProfileField label="Ngành" value={user.major || user.department || "Chưa cập nhật"} /><ProfileField label="Trạng thái" value="Đang theo học" /></div>
      </section>
    </div>
  );

  const renderTeacherDashboard = () => (
    (() => {
      const assignedClasses = getClassesForTeacher(user.id);
      const weekSchedule = assignedClasses.slice(0, 3).map((course) => ({
        time: `${course.startTime} – ${course.endTime}`,
        subject: course.name,
        code: course.code,
        room: course.room,
        students: course.studentIds.length,
        type: `${course.weekday} · ${course.type}`,
      }));
      const overviewStats = teacherStats.map((stat, index) => index === 0
        ? { ...stat, value: String(assignedClasses.length).padStart(2, "0"), note: "Lớp được phân công" }
        : index === 1
          ? { ...stat, value: String(assignedClasses.reduce((total, course) => total + course.studentIds.length, 0)), note: "Theo danh sách lớp hiện có" }
          : stat);
      return (
    <div className="space-y-6">
      <section id="overview" className="dashboard-hero relative isolate min-h-[220px] overflow-hidden rounded-2xl bg-[#103d70] bg-cover bg-center shadow-sm sm:min-h-[250px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(13,49,89,.94), rgba(13,49,89,.46)), url(/images/hcmute-campus.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div aria-hidden="true" className="absolute -right-14 -top-28 -z-10 h-80 w-80 rounded-full border-[38px] border-white/[0.06]" />
        <div aria-hidden="true" className="absolute -bottom-32 right-36 -z-10 h-64 w-64 rounded-full bg-cyan-300/[0.08] blur-2xl" />
        <div className="relative flex min-h-[220px] flex-col justify-between gap-7 p-5 text-white sm:min-h-[250px] sm:p-8 md:flex-row md:items-end">
          <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">Cổng thông tin đào tạo · Giảng viên</p><h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Xin chào, {user.fullName}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-blue-50/90">Quản lý lịch giảng dạy, lớp học và tiến độ học tập của sinh viên.</p></div>
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"><CalendarClock className="h-5 w-5 text-blue-100" /><div><p className="text-[10px] uppercase tracking-[0.12em] text-blue-100">Học kỳ hiện tại</p><p className="mt-1 text-sm font-semibold">Học kỳ 1 · 2026–2027</p></div></div>
        </div>
      </section>

      <section aria-label="Tổng quan giảng dạy" className="dashboard-stagger grid grid-cols-2 gap-3 xl:grid-cols-4">{overviewStats.map((stat) => <StatCard key={stat.label} {...stat} />)}</section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article id="schedule" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5">
          <SectionHeading eyebrow="Học kỳ 1 · 2026–2027" title="Lịch giảng dạy trong tuần" action={<span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{assignedClasses.length} lớp</span>} />
          <div className="space-y-3">{weekSchedule.map((item, index) => <div key={item.code} className="flex gap-3 rounded-xl border border-slate-100 p-3.5">
            <div className="w-[74px] shrink-0 border-r border-slate-100 pr-3"><p className="text-xs font-bold text-blue-800">{item.time.split(" – ")[0]}</p><p className="mt-1 text-[10px] text-slate-400">{item.time.split(" – ")[1]}</p></div>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-slate-800">{item.subject}</p>{index === 0 ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Sắp bắt đầu</span> : null}</div><p className="mt-1 text-[11px] text-slate-500">{item.code} · {item.type}</p><p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500"><MapPin className="h-3 w-3" />Phòng {item.room}<span className="text-slate-300">·</span><Users className="h-3 w-3" />{item.students} sinh viên</p></div>
          </div>)}</div>
        </article>

        <article id="tasks" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5">
          <SectionHeading eyebrow="Cần hoàn thành" title="Việc cần xử lý" action={<span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-amber-50 px-2 text-xs font-bold text-amber-700">3</span>} />
          <div className="space-y-3">{teacherTasks.map((task) => <div key={task.title} className="flex gap-3 rounded-xl border border-slate-100 p-3.5"><span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${task.urgent ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>{task.urgent ? <CircleAlert className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />}</span><div className="min-w-0"><p className="text-sm font-semibold text-slate-800">{task.title}</p><p className="mt-1 text-[11px] text-slate-500">{task.detail}</p><p className={`mt-1.5 text-[10px] font-medium ${task.urgent ? "text-amber-700" : "text-slate-500"}`}>{task.due}</p></div></div>)}</div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article id="classes" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5">
          <SectionHeading eyebrow="Học kỳ 1 · 2026–2027" title="Lớp học phần" action={<span className="text-xs text-slate-500">{filteredClasses.length} lớp</span>} />
          <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-[0.08em] text-slate-400"><th className="pb-2.5 font-semibold">Tên lớp</th><th className="pb-2.5 font-semibold">Mã lớp</th><th className="pb-2.5 font-semibold">Sinh viên</th><th className="pb-2.5 text-right font-semibold">Buổi tới</th><th className="pb-2.5 text-right font-semibold">Thao tác</th></tr></thead><tbody>{filteredClasses.map((item) => <tr key={item.code} className="border-b border-slate-50 last:border-0"><td className="py-3 font-semibold text-slate-700">{item.name}</td><td className="py-3 text-slate-500">{item.code}</td><td className="py-3 text-slate-600">{item.students}</td><td className="py-3 text-right text-slate-500">{item.next}</td><td className="py-3 text-right"><Link href={`/teacher/classes/${item.code}/attendance`} className="rounded-lg bg-blue-50 px-2.5 py-1.5 font-semibold text-blue-800 hover:bg-blue-100">Điểm danh</Link></td></tr>)}</tbody></table>{!filteredClasses.length ? <p className="py-6 text-center text-sm text-slate-500">Không tìm thấy lớp phù hợp.</p> : null}</div>
        </article>

        <article id="attendance" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5">
          <SectionHeading eyebrow="Theo dõi lớp" title="Điểm danh gần đây" action={<ClipboardCheck className="h-5 w-5 text-blue-700" />} />
          <div className="space-y-4">{teacherAttendance.map((item) => <div key={item.name}><div className="mb-2 flex items-center justify-between gap-3"><span className="text-xs font-semibold text-slate-700">{item.name}</span><span className="text-[11px] font-bold text-emerald-700">{item.percent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="dashboard-progress h-full rounded-full bg-emerald-500" style={{ width: `${item.percent}%` }} /></div><p className="mt-1.5 text-[10px] text-slate-400">Có mặt {item.present}/{item.total} sinh viên</p></div>)}</div>
        </article>
      </section>

      <section id="profile" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] sm:p-5"><SectionHeading eyebrow="Tài khoản" title="Thông tin giảng viên" /><div className="grid gap-4 sm:grid-cols-3"><ProfileField label="Họ và tên" value={user.fullName} /><ProfileField label="Mã giảng viên" value={user.studentId || "Chưa cập nhật"} /><ProfileField label="Email" value={user.email} /><ProfileField label="Khoa" value={user.faculty || user.department || "Chưa cập nhật"} /><ProfileField label="Ngành" value={user.major || user.department || "Chưa cập nhật"} /></div></section>
    </div>
      );
    })()
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <section id="overview" className="rounded-2xl bg-gradient-to-r from-[#103d70] to-[#2265a6] p-6 text-white sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">Cổng thông tin đào tạo</p><h1 className="mt-3 text-2xl font-bold sm:text-3xl">Quản lý tài khoản</h1><p className="mt-2 text-sm text-blue-50/90">Theo dõi tài khoản và phân quyền truy cập cho sinh viên, giảng viên.</p></section>
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[
        { label: "Tổng tài khoản", value: accounts.length, icon: Users },
        { label: "Sinh viên", value: accounts.filter((item) => item.role === "student").length, icon: GraduationCap },
        { label: "Giảng viên", value: accounts.filter((item) => item.role === "teacher").length, icon: BookOpen },
        { label: "Quyền quản trị", value: accounts.filter((item) => item.role === "admin").length, icon: ShieldCheck },
      ].map(({ label, value, icon: Icon }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">{label}</p><Icon className="h-4 w-4 text-blue-700" /></div><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></article>)}</section>
      <section id="accounts" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><SectionHeading eyebrow="Quản trị" title="Danh sách tài khoản" action={<span className="text-xs text-slate-500">{filteredAccounts.length} tài khoản</span>} /><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-[0.08em] text-slate-400"><th className="pb-3 font-semibold">Họ và tên</th><th className="pb-3 font-semibold">Khoa / ngành</th><th className="pb-3 font-semibold">Email</th><th className="pb-3 font-semibold">Vai trò</th><th className="pb-3 font-semibold">Phân quyền</th></tr></thead><tbody>{filteredAccounts.map((account) => <tr key={account.id} className="border-b border-slate-50 last:border-0"><td className="py-3 font-semibold text-slate-700">{account.fullName}</td><td className="py-3 text-slate-500">{account.email}</td><td className="py-3 text-slate-500"><span className="font-medium text-slate-700">{account.faculty || account.department || "—"}</span>{account.major ? <span className="mt-1 block text-[10px]">{account.major}</span> : null}</td><td className="py-3"><span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-800">{roleLabels[account.role]}</span></td><td className="py-3">{account.role === "admin" ? <span className="text-slate-400">Quản trị viên</span> : <div className="flex gap-2"><button type="button" onClick={() => handleRoleUpdate(account.id, "student")} className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${account.role === "student" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Sinh viên</button><button type="button" onClick={() => handleRoleUpdate(account.id, "teacher")} className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${account.role === "teacher" ? "bg-violet-100 text-violet-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Giảng viên</button></div>}</td></tr>)}</tbody></table>{!filteredAccounts.length ? <p className="py-6 text-center text-sm text-slate-500">Không tìm thấy tài khoản phù hợp.</p> : null}</div></section>
      <section id="profile" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><SectionHeading eyebrow="Tài khoản" title="Thông tin cá nhân" /><div className="grid gap-4 sm:grid-cols-3"><ProfileField label="Họ và tên" value={user.fullName} /><ProfileField label="Email" value={user.email} /><ProfileField label="Vai trò" value={roleLabels[user.role]} /></div></section>
    </div>
  );

  const notificationHref = user.role === "student" ? "#announcements" : user.role === "teacher" ? "#tasks" : "#accounts";

  return (
    <main className="portal-dashboard min-h-screen bg-[#f4f7fb] text-slate-800">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0d3159] text-white shadow-sm">
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMobileNavOpen(true)} aria-label="Mở menu" className="rounded-lg border border-white/15 p-2 text-white transition hover:bg-white/10 lg:hidden"><Menu className="h-5 w-5" /></button>
            <div className="flex h-9 min-w-[58px] items-center justify-center rounded-md bg-white px-1.5 sm:h-10 sm:min-w-[76px] sm:px-2"><Image src="/images/logo.png" alt="Logo công ty" width={720} height={424} className="h-7 w-auto object-contain sm:h-8" priority /></div>
            <div className="min-w-0"><p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-200">Cổng thông tin đào tạo</p><p className="truncate text-sm font-bold sm:text-base">Công ty trách nhiệm hữu hạn Phan Gia Phước</p></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <label className="hidden h-9 w-52 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 text-blue-100 md:flex lg:w-64"><Search className="h-4 w-4 shrink-0" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={user.role === "student" ? "Tìm thông báo..." : user.role === "teacher" ? "Tìm lớp học..." : "Tìm tài khoản..."} aria-label="Tìm kiếm" className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-blue-100/60" /></label>
            <Link href={notificationHref} aria-label="Mở thông báo và công việc" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-blue-50 transition hover:bg-white/10"><Bell className="h-4 w-4" /><span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">3</span></Link>
            <div className="hidden h-9 items-center gap-2 rounded-lg bg-white/10 px-2.5 sm:flex"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#0d3159]">{user.fullName.split(" ").slice(-2).map((part) => part[0]).join("").toUpperCase()}</span><span className="max-w-32 truncate text-xs font-medium">{user.fullName}</span></div>
          </div>
        </div>
      </header>

      {mobileNavOpen ? <div className="fixed inset-0 z-50 lg:hidden"><button type="button" onClick={closeMobileNav} aria-label="Đóng menu" className="absolute inset-0 h-full w-full bg-slate-950/45" /><aside className="relative z-10 flex h-full w-[286px] max-w-[86vw] flex-col overflow-y-auto bg-white p-4 shadow-2xl"><div className="mb-3 flex justify-end"><button type="button" onClick={closeMobileNav} aria-label="Đóng menu" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>{renderSidebar(closeMobileNav)}</aside></div> : null}

      <div className="mx-auto flex max-w-[1600px] gap-6 px-3 py-4 sm:px-6 sm:py-6">
        <aside className="sticky top-[92px] hidden h-[calc(100vh-116px)] w-[245px] shrink-0 flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.03)] lg:flex">{renderSidebar()}</aside>
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between gap-3 px-1 text-xs text-slate-500"><div className="flex items-center gap-2"><span className="font-medium text-slate-700">{roleLabels[user.role]}</span><ChevronRight className="h-3 w-3" /><span>Tổng quan</span></div><span className="hidden items-center gap-1 sm:flex"><Clock3 className="h-3.5 w-3.5" /> Học kỳ 1 · 2026–2027</span></div>
          {user.role === "student" ? renderStudentDashboard() : user.role === "teacher" ? renderTeacherDashboard() : renderAdminDashboard()}
          <footer className="py-6 text-center text-[10px] text-slate-400">Cổng thông tin đào tạo · Công ty TNHH Phan Gia Phước</footer>
        </div>
      </div>
    </main>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</p><p className="mt-1 truncate text-sm font-medium text-slate-700">{value}</p></div>;
}
