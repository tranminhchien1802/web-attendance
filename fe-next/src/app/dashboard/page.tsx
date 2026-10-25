"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarClock,
  CheckCheck,
  ChevronRight,
  Clock3,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { getCurrentUser, getUsers, logoutUser, updateUserRole, type AppUser } from "@/lib/auth";

const navByRole: Record<string, { label: string; icon: any; href: string }[]> = {
  student: [
    { label: "Tổng quan", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Lịch học", icon: CalendarClock, href: "/dashboard" },
    { label: "Điểm danh", icon: CheckCheck, href: "/dashboard" },
    { label: "Học phí", icon: CreditCard, href: "/dashboard" },
  ],
  teacher: [
    { label: "Tổng quan", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Lớp học", icon: BookOpen, href: "/dashboard" },
    { label: "Điểm danh", icon: CheckCheck, href: "/dashboard" },
    { label: "Thông báo", icon: Bell, href: "/dashboard" },
  ],
  admin: [
    { label: "Tổng quan", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Quản lý người dùng", icon: Users, href: "/dashboard" },
    { label: "Phân quyền", icon: ShieldCheck, href: "/dashboard" },
    { label: "Báo cáo", icon: GraduationCap, href: "/dashboard" },
  ],
};

const studentStats = [
  { label: "Tổng tín chỉ", value: "96/140", note: "+6 so với kỳ trước", tone: "blue" },
  { label: "Điểm TB", value: "3.42", note: "Xếp loại Khá", tone: "green" },
  { label: "Số buổi vắng", value: "02", note: "Trong học kỳ", tone: "amber" },
  { label: "Học phí còn nợ", value: "4.2M", note: "Đến hạn 20/11", tone: "rose" },
];

const teacherStats = [
  { label: "Lớp đang dạy", value: "08", note: "2 lớp mới", tone: "blue" },
  { label: "Sinh viên", value: "420", note: "Tổng số lớp", tone: "green" },
  { label: "Bài tập chấm", value: "182", note: "Cần xử lý", tone: "amber" },
  { label: "Điểm danh", value: "96%", note: "Đúng tiến độ", tone: "rose" },
];

const adminStats = [
  { label: "Sinh viên", value: "1,240", note: "Đang học tập", tone: "blue" },
  { label: "Giảng viên", value: "128", note: "Đang giảng dạy", tone: "green" },
  { label: "Tài khoản chờ", value: "14", note: "Cần duyệt", tone: "amber" },
  { label: "Thời khóa biểu", value: "96%", note: "Đã đồng bộ", tone: "rose" },
];

const studentSchedule = [
  { time: "07:30 - 09:00", subject: "Lập trình Web", room: "A1.302", type: "Lý thuyết" },
  { time: "09:15 - 10:45", subject: "Cơ sở dữ liệu", room: "B2.204", type: "Thực hành" },
  { time: "13:30 - 15:00", subject: "Trí tuệ nhân tạo", room: "C3.105", type: "Seminar" },
];

const teacherSchedule = [
  { time: "08:00 - 09:30", subject: "Lập trình Web 1", room: "A1.302", type: "Tiết 1" },
  { time: "10:00 - 11:30", subject: "Cơ sở dữ liệu", room: "B2.204", type: "Tiết 2" },
  { time: "13:30 - 15:00", subject: "Phương pháp nghiên cứu", room: "C3.105", type: "Seminar" },
];

const studentFocusCards = [
  { label: "Đăng ký học phần", value: "12 TC", meta: "Đã hoàn thành" },
  { label: "Kết quả học tập", value: "3.42", meta: "Điểm trung bình" },
  { label: "Học phí", value: "4.2M", meta: "Còn nợ" },
  { label: "Điểm danh", value: "96%", meta: "Hiện tại" },
];

const teacherFocusCards = [
  { label: "Lớp đang giảng", value: "08", meta: "Lớp chính" },
  { label: "Điểm danh", value: "96%", meta: "Tỷ lệ hiện tại" },
  { label: "Bài tập", value: "182", meta: "Cần chấm" },
  { label: "Sinh viên", value: "420", meta: "Theo dõi" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [accounts, setAccounts] = useState<AppUser[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace("/login");
      return;
    }

    setUser(currentUser);
    setAccounts(getUsers());
  }, [router]);

  const stats = useMemo(() => {
    if (user?.role === "teacher") return teacherStats;
    if (user?.role === "admin") return adminStats;
    return studentStats;
  }, [user]);

  const schedule = useMemo(() => (user?.role === "teacher" ? teacherSchedule : studentSchedule), [user]);
  const navItems = user ? navByRole[user.role] ?? navByRole.student : navByRole.student;

  if (!user) return null;

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const handleRoleUpdate = (targetId: string, nextRole: "student" | "teacher") => {
    updateUserRole(targetId, nextRole);
    setAccounts(getUsers());
  };

  const renderAdminDashboard = () => (
    <>
      <section className="rounded-[28px] bg-gradient-to-r from-[#0a2d59] to-[#1c5fc8] p-5 text-white shadow-[0_18px_40px_rgba(11,45,89,0.22)] md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-blue-100">Phân quyền hệ thống</p>
            <h2 className="mt-1 text-3xl font-bold md:text-4xl">Quản trị HCMUTE</h2>
            <p className="mt-2 max-w-xl text-sm text-blue-100/90">
              Admin cấp tài khoản, phân bổ vai trò sinh viên hoặc giảng viên và theo dõi các hoạt động của hệ thống.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-100/80">Vai trò</p>
            <p className="mt-1 text-xl font-bold">Quản trị viên</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, tone }) => (
          <div key={label} className="card-hover rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                tone === "blue" ? "bg-blue-100 text-blue-700" : tone === "green" ? "bg-emerald-100 text-emerald-700" : tone === "amber" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                <Clock3 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-500">{note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Quản lý tài khoản</h3>
            <span className="rounded-full bg-[#edf3fb] px-2.5 py-1 text-xs font-semibold text-[#0e3b7a]">{accounts.length} tài khoản</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Tên</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Vai trò</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{account.fullName}</td>
                    <td className="px-4 py-3 text-slate-600">{account.email}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0e3b7a]">
                        {account.role === "student" ? "Sinh viên" : account.role === "teacher" ? "Giảng viên" : "Admin"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {account.role === "admin" ? (
                        <span className="text-xs font-medium text-slate-400">Không thay đổi</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleRoleUpdate(account.id, "student")}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${account.role === "student" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
                          >
                            Sinh viên
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRoleUpdate(account.id, "teacher")}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${account.role === "teacher" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-700"}`}
                          >
                            Giảng viên
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <h3 className="text-lg font-bold text-slate-900">Quy trình cấp quyền</h3>
          <div className="mt-5 space-y-4">
            {[
              "Admin xem danh sách tài khoản trong hệ thống.",
              "Cấp quyền Sinh viên cho tài khoản học tập của trường.",
              "Cấp quyền Giảng viên cho tài khoản giảng dạy và chấm điểm.",
              "Tài khoản admin giữ quyền quản trị toàn bộ hệ thống.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const renderTeacherDashboard = () => (
    <>
      <section className="rounded-[28px] bg-gradient-to-r from-[#0a2d59] to-[#1c5fc8] p-5 text-white shadow-[0_18px_40px_rgba(11,45,89,0.22)] md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-blue-100">Bảng điều khiển giảng viên</p>
            <h2 className="mt-1 text-3xl font-bold md:text-4xl">{user.fullName}</h2>
            <p className="mt-2 max-w-xl text-sm text-blue-100/90">
              Theo dõi lớp học, điểm danh, lịch giảng dạy và cập nhật bài tập cho sinh viên.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-blue-100/80">Vai trò</p>
            <p className="mt-1 text-xl font-bold">Giảng viên</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(user.role === "teacher" ? teacherFocusCards : studentFocusCards).map(({ label, value, meta }) => (
          <div key={label} className="card-hover rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-500">{meta}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Lịch dạy hôm nay</h3>
            <button className="text-sm font-semibold text-[#0e3b7a]">Xem chi tiết</button>
          </div>
          <div className="space-y-3">
            {schedule.map(({ time, subject, room, type }) => (
              <div key={subject} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{time}</p>
                  <p className="mt-1 text-base font-bold text-slate-900">{subject}</p>
                  <p className="text-sm text-slate-500">{room} · {type}</p>
                </div>
                <div className="rounded-full bg-[#edf3fb] px-3 py-1.5 text-xs font-semibold text-[#0e3b7a]">{type}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <h3 className="text-lg font-bold text-slate-900">Thông tin cá nhân</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Email</div>
              <div className="mt-1 font-semibold text-slate-800">{user.email}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Khoa / Phòng</div>
              <div className="mt-1 font-semibold text-slate-800">{user.department || "Chưa cập nhật"}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Mã giảng viên</div>
              <div className="mt-1 font-semibold text-slate-800">{user.studentId || "GV-0001"}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <h3 className="text-lg font-bold text-slate-900">Điểm danh lớp học</h3>
          <div className="mt-5 space-y-3">
            {[
              { className: "Lập trình Web 1", total: 42, present: 40, percent: "95%" },
              { className: "Cơ sở dữ liệu", total: 38, present: 36, percent: "95%" },
              { className: "Phương pháp nghiên cứu", total: 30, present: 28, percent: "93%" },
            ].map((item) => (
              <div key={item.className} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800">{item.className}</p>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-700">{item.percent}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Có mặt {item.present}/{item.total} sinh viên</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <h3 className="text-lg font-bold text-slate-900">Công việc gần đây</h3>
          <div className="mt-5 space-y-3">
            {[
              "Nhắc nhở sinh viên nộp bài tập Lab 03",
              "Cập nhật điểm kiểm tra giữa kỳ cho nhóm Web",
              "Chuẩn bị nội dung seminar tuần tới",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{item}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const renderStudentDashboard = () => {
    const noticeRows = [
      { title: "Thông báo bảo trì hệ thống cổng thông tin đào tạo", sender: "POT_BTL_Quý Thịnh", time: "13/07/2026\n15:03:24" },
      { title: "Thông báo dời lịch học và thi cho sinh viên kế hoạch 2026", sender: "POT_BTL_Quý Thịnh", time: "17/06/2026\n15:15:27" },
      { title: "Thông báo về lịch kiểm tra trình độ tiếng Anh đầu vào", sender: "POT_Thâm Thúy Hạnh", time: "04/06/2026\n16:50:01" },
      { title: "Thông báo về lịch đánh giá thường xuyên giữa kỳ", sender: "POT_Thâm Thúy Hạnh", time: "16/05/2026\n18:30:31" },
      { title: "Thông báo điều chỉnh lịch thi học kỳ", sender: "POT_BTL_Quý Thịnh", time: "09/05/2026\n09:50:43" },
      { title: "Thông báo về lịch tập trung sinh viên mới", sender: "POT_BTL_Quý Thịnh", time: "19/01/2026\n07:35:15" },
    ];

    const overviewCards = [
      { label: "Tổng tín chỉ", value: "96/140", note: "+6 so với kỳ trước", tone: "blue" },
      { label: "Điểm trung bình", value: "3.42", note: "Xếp loại Khá", tone: "green" },
      { label: "Số buổi vắng", value: "02", note: "Trong học kỳ", tone: "amber" },
      { label: "Học phí còn nợ", value: "4.2M", note: "Đến hạn 20/11", tone: "rose" },
    ];

    const attendance = [
      { label: "Lập trình Web", ratio: "95%", present: 40, total: 42 },
      { label: "Cơ sở dữ liệu", ratio: "96%", present: 37, total: 38 },
      { label: "Mạng máy tính", ratio: "94%", present: 32, total: 34 },
    ];

    const academicResults = [
      { subject: "Lập trình Web", score: "3.8", type: "GPA" },
      { subject: "Cơ sở dữ liệu", score: "3.6", type: "GPA" },
      { subject: "Trí tuệ nhân tạo", score: "3.7", type: "GPA" },
      { subject: "Tiếng Anh chuyên ngành", score: "3.5", type: "GPA" },
    ];

    const tuition = [
      { title: "Học phí học kỳ 2026-1", amount: "6.800.000đ", status: "Đã thanh toán" },
      { title: "Học phí học kỳ 2026-2", amount: "4.200.000đ", status: "Còn nợ" },
      { title: "Phí bảo hiểm y tế", amount: "1.200.000đ", status: "Đã thanh toán" },
    ];

    const timetable = [
      { day: "Thứ 2", slots: [
        { time: "07:30-09:00", subject: "Lập trình Web", room: "A1.302", type: "Lý thuyết" },
        { time: "09:15-10:45", subject: "Cơ sở dữ liệu", room: "B2.204", type: "Thực hành" },
      ] },
      { day: "Thứ 3", slots: [
        { time: "13:30-15:00", subject: "Trí tuệ nhân tạo", room: "C3.105", type: "Seminar" },
      ] },
      { day: "Thứ 4", slots: [
        { time: "07:30-09:00", subject: "Mạng máy tính", room: "D4.101", type: "Lý thuyết" },
        { time: "09:15-10:45", subject: "Thực hành Mạng", room: "D4.102", type: "Lab" },
      ] },
      { day: "Thứ 5", slots: [
        { time: "13:30-15:00", subject: "Phân tích thiết kế phần mềm", room: "E5.210", type: "Lý thuyết" },
      ] },
      { day: "Thứ 6", slots: [
        { time: "07:30-09:00", subject: "Tiếng Anh chuyên ngành", room: "F6.110", type: "Học phần" },
      ] },
    ];

    return (
      <div className="space-y-6">
        <section className="rounded-[4px] border border-[#c8d2dc] bg-[#f3f4f5] shadow-sm">
          <div className="border-b border-[#d6dee6] bg-[#f5f7f9] px-4 py-3 text-center">
            <h2 className="text-[18px] font-black uppercase tracking-[0.08em] text-[#0d4d90]">Thông báo</h2>
          </div>

          <div className="border-b border-[#d6dee6] bg-[#edf1f5] px-4 py-2 text-[12px] font-semibold text-[#274167]">
            <div className="flex gap-4">
              <button type="button" className="border-b-2 border-[#0d4d90] pb-2 text-[#0d4d90]">Thông báo chung</button>
              <button type="button" className="pb-2 text-[#4c5d72]">Thông báo cá nhân</button>
            </div>
          </div>

          <div className="px-4 py-3">
            <div className="mb-3 flex items-center gap-2 rounded-[4px] border border-[#bcc8d4] bg-white px-3 py-2 shadow-inner shadow-slate-100">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm thông báo"
                className="w-full border-none bg-transparent text-[12px] text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="overflow-hidden border border-[#cbd5de] bg-white">
              <table className="min-w-full border-collapse text-left text-[12px]">
                <thead className="bg-[#eef4fb] text-[#0d4d90]">
                  <tr>
                    <th className="border-b border-r border-[#d7dfe8] px-3 py-3 font-bold">Tiêu đề</th>
                    <th className="border-b border-r border-[#d7dfe8] px-3 py-3 font-bold">Người gửi</th>
                    <th className="border-b border-[#d7dfe8] px-3 py-3 font-bold">Thời gian gửi</th>
                  </tr>
                </thead>
                <tbody>
                  {noticeRows.map((row) => (
                    <tr key={row.title} className="border-b border-[#edf0f4] hover:bg-[#fafbfd]">
                      <td className="border-r border-[#edf0f4] px-3 py-3 text-[12px] font-medium text-[#0d4d90] underline decoration-[#7ca9d9] underline-offset-2">
                        {row.title}
                      </td>
                      <td className="border-r border-[#edf0f4] px-3 py-3 text-[12px] text-[#2f4157]">{row.sender}</td>
                      <td className="px-3 py-3 text-[12px] whitespace-pre-line text-[#2f4157]">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map(({ label, value, note, tone }) => (
            <div key={label} className="rounded-[6px] border border-[#d8e3f1] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] text-slate-500">{label}</p>
                  <p className="mt-2 text-[28px] font-black text-[#0d4d90]">{value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-[10px] ${
                  tone === "blue" ? "bg-[#eaf3ff] text-[#0d4d90]" :
                  tone === "green" ? "bg-[#ebf9f1] text-[#1f9d63]" :
                  tone === "amber" ? "bg-[#fff7de] text-[#c58a00]" : "bg-[#ffe9ec] text-[#d7254b]"
                }`}>
                  <Clock3 className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-500">{note}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[4px] border border-[#c8d2dc] bg-[#f3f4f5] shadow-sm">
            <div className="border-b border-[#d6dee6] bg-[#f5f7f9] px-4 py-3 text-left">
              <h2 className="text-[18px] font-black uppercase tracking-[0.08em] text-[#0d4d90]">Điểm danh</h2>
            </div>
            <div className="space-y-3 p-4">
              {attendance.map((item) => (
                <div key={item.label} className="rounded-[6px] border border-[#dde5ee] bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-semibold text-slate-800">{item.label}</span>
                    <span className="rounded-full bg-[#eaf3ff] px-2 py-1 text-[11px] font-bold text-[#0d4d90]">{item.ratio}</span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">Có mặt {item.present}/{item.total} buổi</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[4px] border border-[#c8d2dc] bg-[#f3f4f5] shadow-sm">
            <div className="border-b border-[#d6dee6] bg-[#f5f7f9] px-4 py-3 text-left">
              <h2 className="text-[18px] font-black uppercase tracking-[0.08em] text-[#0d4d90]">Học phí</h2>
            </div>
            <div className="space-y-3 p-4">
              {tuition.map((item) => (
                <div key={item.title} className="rounded-[6px] border border-[#dde5ee] bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] font-semibold text-slate-800">{item.title}</span>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                      item.status === "Còn nợ" ? "bg-[#ffe9ec] text-[#d7254b]" : "bg-[#ebf9f1] text-[#1f9d63]"
                    }`}>{item.status}</span>
                  </div>
                  <div className="mt-2 text-[13px] font-bold text-[#0d4d90]">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[4px] border border-[#c8d2dc] bg-[#f3f4f5] shadow-sm">
          <div className="border-b border-[#d6dee6] bg-[#f5f7f9] px-4 py-3 text-left">
            <h2 className="text-[18px] font-black uppercase tracking-[0.08em] text-[#0d4d90]">Kết quả học tập</h2>
          </div>
          <div className="overflow-hidden p-4">
            <div className="overflow-hidden border border-[#d7dfe8] bg-white">
              <table className="min-w-full text-left text-[12px]">
                <thead className="bg-[#eef4fb] text-[#0d4d90]">
                  <tr>
                    <th className="border-b border-r border-[#e3eaf3] px-3 py-3 font-bold">Môn học</th>
                    <th className="border-b border-r border-[#e3eaf3] px-3 py-3 font-bold">Điểm</th>
                    <th className="border-b border-[#e3eaf3] px-3 py-3 font-bold">Loại</th>
                  </tr>
                </thead>
                <tbody>
                  {academicResults.map((result) => (
                    <tr key={result.subject} className="border-b border-[#edf0f4] hover:bg-[#fafbfd]">
                      <td className="border-r border-[#edf0f4] px-3 py-3 text-slate-800">{result.subject}</td>
                      <td className="border-r border-[#edf0f4] px-3 py-3 font-bold text-[#0d4d90]">{result.score}</td>
                      <td className="px-3 py-3 text-slate-600">{result.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-[4px] border border-[#c8d2dc] bg-[#f3f4f5] shadow-sm">
          <div className="border-b border-[#d6dee6] bg-[#f5f7f9] px-4 py-3">
            <h2 className="text-[18px] font-black uppercase tracking-[0.08em] text-[#0d4d90]">Thời khóa biểu</h2>
          </div>

          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {timetable.map((day) => (
              <div key={day.day} className="rounded-[6px] border border-[#d5dfe9] bg-white p-3 shadow-sm">
                <div className="mb-3 border-b border-[#e8edf3] pb-2 text-[13px] font-black uppercase tracking-[0.08em] text-[#0d4d90]">{day.day}</div>
                <div className="space-y-3">
                  {day.slots.length ? day.slots.map((slot) => (
                    <div key={`${day.day}-${slot.time}`} className="rounded-[4px] bg-[#eef5ff] p-2.5">
                      <div className="text-[11px] font-bold text-[#0d4d90]">{slot.time}</div>
                      <div className="mt-1 text-[13px] font-semibold text-[#1f2a37]">{slot.subject}</div>
                      <div className="mt-1 text-[11px] text-slate-600">{slot.room} · {slot.type}</div>
                    </div>
                  )) : (
                    <div className="text-[11px] text-slate-500">Không có lịch học</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#edf3fb] text-slate-800">
      <div className="mx-auto max-w-[1600px] px-4 py-5 lg:px-6">
        <header className="rounded-[28px] bg-[#0c2c62] px-5 py-4 text-white shadow-[0_25px_60px_rgba(12,44,98,0.18)] lg:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold shadow-inner shadow-white/10">
                H
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-blue-100/80">Campus portal</p>
                <h1 className="text-xl font-bold md:text-2xl">HCMUTE</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-blue-100 md:flex">
                <Search className="h-4 w-4" />
                <span>Tìm kiếm...</span>
              </div>
              <button className="relative rounded-full border border-white/15 bg-white/5 p-2.5 transition hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  3
                </span>
              </button>
              <div className="flex items-center gap-3 rounded-full bg-white/8 px-2 py-1.5 pr-3 ring-1 ring-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0c2c62]">
                  {user.fullName
                    .split(" ")
                    .slice(-2)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold">{user.fullName}</p>
                  <p className="text-[11px] text-blue-100">{user.role === "teacher" ? "Giảng viên" : user.role === "admin" ? "Quản trị" : "Sinh viên"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 flex min-h-[calc(100vh-160px)] gap-6">
          <aside className="w-[220px] shrink-0 rounded-[28px] bg-[#0d4d90] p-4 text-white shadow-[0_18px_40px_rgba(13,77,144,0.18)]">
            <div className="mb-5 flex flex-col items-center gap-2 border-b border-white/10 pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white bg-[#0b3b75] text-[26px] font-black">H</div>
              <div className="text-[12px] font-black uppercase tracking-[0.08em] text-blue-100">HCM-UTE</div>
            </div>

            <div className="space-y-4 text-[12px]">
              <div className="rounded-md border border-white/10 bg-white/5 p-2.5">
                <div className="text-[11px] uppercase tracking-[0.08em] text-blue-100/80">Sinh viên</div>
                <div className="mt-2 font-semibold text-white">{user.fullName}</div>
                <div className="mt-1 text-[11px] text-blue-100/80">MSSV: {user.studentId || "20124001"}</div>
              </div>

              <div>
                <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-blue-100/80">Trạng cá nhân</div>
                <nav className="space-y-1">
                  {[
                    { label: "Trang chủ", icon: LayoutDashboard, active: true },
                    { label: "Thông tin cá nhân", icon: Users },
                    { label: "Lịch học", icon: CalendarClock },
                    { label: "Đăng ký học phần", icon: BookOpen },
                    { label: "Điểm danh", icon: CheckCheck },
                    { label: "Kết quả học tập", icon: GraduationCap },
                    { label: "Học phí", icon: CreditCard },
                    { label: "Thông tin tài khoản", icon: ShieldCheck },
                  ].map(({ label, icon: Icon, active }) => (
                    <Link
                      key={label}
                      href="/dashboard"
                      className={`flex items-center justify-between rounded-md px-2 py-2 text-left transition ${
                        active ? "bg-white/10 font-semibold text-white" : "text-blue-50/90 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-2 py-2 text-left text-blue-50/90 transition hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="h-3.5 w-3.5" />
                      Đăng xuất
                    </span>
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          <main className="flex-1 space-y-6">
            {user.role === "admin" ? renderAdminDashboard() : user.role === "teacher" ? renderTeacherDashboard() : renderStudentDashboard()}
          </main>
        </div>
      </div>
    </main>
  );
}
