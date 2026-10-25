"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, BookOpen, Check, Mail, ShieldCheck, UserRound } from "lucide-react";
import { registerUser, type UserRole } from "@/lib/auth";

const roleOptions: { label: string; value: UserRole }[] = [
  { label: "Sinh viên", value: "student" },
  { label: "Giảng viên", value: "teacher" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student" as UserRole,
    department: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      registerUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.department,
      });
      router.push("/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#edf5ff_0%,#edf3fb_30%,#dfeafc_100%)] px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_25px_70px_rgba(15,23,42,0.12)] md:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-[#8caef3] hover:text-[#0b2d5a]">
            <ArrowLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full bg-[#edf3ff] px-3 py-2 text-sm font-semibold text-[#0b2d5a]">
            <ShieldCheck className="h-4 w-4" />
            HCMUTE Portal
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[28px] bg-[#0b2d5a] p-6 text-white">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl font-black">
              H
            </div>
            <p className="text-sm uppercase tracking-[0.18em] text-blue-100/80">Tạo tài khoản</p>
            <h1 className="mt-3 text-3xl font-black">Tham gia hệ thống HCMUTE</h1>
            <p className="mt-4 max-w-sm text-blue-100/80">
              Đăng ký tài khoản để theo dõi lịch học, điểm danh, học phí và kết quả học tập của bạn.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Quản lý thời khóa biểu và thông báo",
                "Theo dõi điểm danh và kết quả học tập",
                "Phù hợp cho sinh viên và giảng viên",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-blue-50">
                  <Check className="h-4 w-4 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="p-2 md:p-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <UserRound className="h-5 w-5 text-slate-400" />
                  <input
                    value={form.fullName}
                    onChange={(event) => handleChange("fullName", event.target.value)}
                    type="text"
                    className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <input
                    value={form.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    type="email"
                    className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="name@hcmute.edu.vn"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
                <input
                  value={form.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                  type="password"
                  minLength={6}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-[#5d8ef7] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Ít nhất 6 ký tự"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Vai trò</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange("role", option.value)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        form.role === option.value
                          ? "border-[#0b2d5a] bg-[#0b2d5a] text-white shadow-md"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#8caef3] hover:bg-[#f2f7ff]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Khoa / Bộ môn</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <BookOpen className="h-5 w-5 text-slate-400" />
                  <input
                    value={form.department}
                    onChange={(event) => handleChange("department", event.target.value)}
                    type="text"
                    className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="Khoa Công nghệ Thông tin"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#0b2d5a] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#123d7c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
