import Link from "next/link";
import {
  BellRing,
  BookOpenText,
  CalendarClock,
  CheckCheck,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutGrid,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const navGroups = [
  {
    title: "Tổng quan",
    items: [
      { label: "Bảng điều khiển", active: true, icon: LayoutGrid },
      { label: "Thông báo", icon: BellRing },
      { label: "Hồ sơ", icon: UserRound },
    ],
  },
  {
    title: "Học tập",
    items: [
      { label: "Lịch học", icon: CalendarClock },
      { label: "Chương trình đào tạo", icon: BookOpenText },
      { label: "Xem điểm", icon: FileText },
    ],
  },
  {
    title: "Khác",
    items: [
      { label: "Điểm danh", icon: CheckCheck },
      { label: "Học phí", icon: CreditCard },
      { label: "Kết quả học tập", icon: GraduationCap },
    ],
  },
];

const summaryCards = [
  { label: "Tổng tín chỉ đã học", value: "96/140", note: "+6 so với kỳ trước", tone: "blue" },
  { label: "Điểm trung bình", value: "3.42", note: "Xếp loại Khá", tone: "green" },
  { label: "Số buổi vắng", value: "02", note: "Trong học kỳ này", tone: "amber" },
  { label: "Học phí còn nợ", value: "4.2M", note: "Đến hạn 20/11", tone: "rose" },
];

const quickActions = [
  { label: "Đăng ký học phần", icon: BookOpenText },
  { label: "Theo dõi điểm danh", icon: CheckCheck },
  { label: "Xem thời khóa biểu", icon: CalendarClock },
  { label: "Tra cứu học phí", icon: CreditCard },
];

const schedule = [
  { time: "07:30 - 09:00", subject: "Lập trình Web", room: "A1.302", type: "Lý thuyết" },
  { time: "09:15 - 10:45", subject: "Cơ sở dữ liệu", room: "B2.204", type: "Thực hành" },
  { time: "13:30 - 15:00", subject: "Trí tuệ nhân tạo", room: "C3.105", type: "Seminar" },
  { time: "15:15 - 16:45", subject: "Tiếng Anh chuyên ngành", room: "D4.210", type: "Lý thuyết" },
];

const notices = [
  { title: "Khai giảng học kỳ 1 năm học 2025-2026", meta: "Học viện / 2 ngày trước" },
  { title: "Đăng ký học phần đợt 2 sắp đóng", meta: "Phòng Đào tạo / 1 ngày trước" },
  { title: "Lịch thi giữa kỳ đã được cập nhật", meta: "Khoa CNTT / Hôm nay" },
];

export default function StudentPortalPage() {
  return (
    <div className="min-h-screen bg-[#edf3fb] text-slate-800">
      <div className="mx-auto max-w-[1500px] px-4 py-5 lg:px-6">
        <header className="rounded-[28px] bg-[#0c2c62] px-5 py-4 shadow-[0_25px_60px_rgba(12,44,98,0.18)] lg:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold text-white shadow-inner shadow-white/10">
                H
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-blue-200">Student portal</p>
                <h1 className="text-xl font-bold text-white md:text-2xl">HCMUTE</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-blue-100 md:flex">
                <Search className="h-4 w-4" />
                <span>Tìm kiếm...</span>
              </div>
              <button className="relative rounded-full border border-white/15 bg-white/5 p-2.5 text-white transition hover:bg-white/10">
                <BellRing className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  3
                </span>
              </button>
              <div className="flex items-center gap-3 rounded-full bg-white/8 px-2 py-1.5 pr-3 text-white ring-1 ring-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0c2c62]">
                  SV
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold">Nguyễn Văn A</p>
                  <p className="text-[11px] text-blue-100">Kỹ thuật phần mềm</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[28px] bg-[#0e3b7a] p-4 text-white shadow-[0_18px_40px_rgba(14,59,122,0.2)]">
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-white/6 px-3 py-2.5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-blue-100/80">Tài khoản</p>
                <p className="mt-1 text-sm font-semibold">Sinh viên</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
            </div>

            <nav className="space-y-4">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100/70">
                    {group.title}
                  </p>
                  <div className="space-y-1.5">
                    {group.items.map(({ label, icon: Icon, active }) => (
                      <Link
                        key={label}
                        href="#"
                        className={`flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition ${
                          active
                            ? "bg-white text-[#0e3b7a] shadow-sm"
                            : "text-blue-50/90 hover:bg-white/8 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          {label}
                        </span>
                        <ChevronRight className="h-4 w-4 opacity-70" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          <main className="space-y-6">
            <section className="rounded-[28px] bg-gradient-to-r from-[#0a2d59] to-[#1c5fc8] p-5 text-white shadow-[0_18px_40px_rgba(11,45,89,0.22)] md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm text-blue-100">Xin chào,</p>
                  <h2 className="mt-1 text-3xl font-bold md:text-4xl">Nguyễn Văn A</h2>
                  <p className="mt-2 max-w-xl text-sm text-blue-100/90">
                    Chúc bạn một ngày học tập hiệu quả. Hệ thống đang cập nhật lịch học và thông báo mới nhất cho bạn.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-blue-100/80">Học kỳ</p>
                  <p className="mt-1 text-xl font-bold">2025 - 2026</p>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map(({ label, value, note, tone }) => (
                <div
                  key={label}
                  className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">{label}</p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
                    </div>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        tone === "blue"
                          ? "bg-blue-100 text-blue-700"
                          : tone === "green"
                            ? "bg-emerald-100 text-emerald-700"
                            : tone === "amber"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      <Clock3 className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-xs font-medium text-slate-500">{note}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Lịch học hôm nay</h3>
                  <button className="text-sm font-semibold text-[#0e3b7a]">Xem toàn bộ</button>
                </div>

                <div className="space-y-3">
                  {schedule.map(({ time, subject, room, type }) => (
                    <div
                      key={subject}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{time}</p>
                        <p className="mt-1 text-base font-bold text-slate-900">{subject}</p>
                        <p className="text-sm text-slate-500">
                          {room} · {type}
                        </p>
                      </div>
                      <div className="rounded-full bg-[#edf3fb] px-3 py-1.5 text-xs font-semibold text-[#0e3b7a]">
                        {type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                <h3 className="text-lg font-bold text-slate-900">Thao tác nhanh</h3>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {quickActions.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-[#9bb9eb] hover:bg-[#f4f8ff]"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0e3b7a] shadow-sm">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-slate-700">{label}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                <h3 className="text-lg font-bold text-slate-900">Thông báo mới</h3>
                <div className="mt-5 space-y-3">
                  {notices.map((notice) => (
                    <div key={notice.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-800">{notice.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{notice.meta}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                <h3 className="text-lg font-bold text-slate-900">Kết quả học tập gần đây</h3>
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-slate-700">Môn học</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">TC</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Điểm</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Xếp loại</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {[
                        ["Lập trình Web", "3", "3.8", "A"],
                        ["Cơ sở dữ liệu", "3", "3.4", "B+"],
                        ["Đường lối ĐCSVN", "2", "3.9", "A"],
                        ["Tiếng Anh chuyên ngành", "2", "3.2", "B"],
                      ].map(([subject, tc, score, rank]) => (
                        <tr key={subject} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-700">{subject}</td>
                          <td className="px-4 py-3 text-slate-600">{tc}</td>
                          <td className="px-4 py-3 text-slate-600">{score}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                              {rank}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
