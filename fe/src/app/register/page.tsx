"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { registerUser, type UserRole } from "@/lib/auth";

const roleOptions: { label: string; value: Extract<UserRole, "student" | "teacher"> }[] = [
  { label: "Sinh viên", value: "student" },
  { label: "Giảng viên", value: "teacher" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student" as Extract<UserRole, "student" | "teacher">,
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
    <AuthShell wide>
      <div className="rounded-[8px] border border-[#dfe5ec] bg-white p-5 shadow-[0_20px_60px_rgba(8,30,60,0.12)] sm:p-7">
        <div className="text-center">
          <h2 className="text-[22px] font-medium uppercase tracking-[0.08em] text-[#0d2461]">Đăng ký</h2>
          <p className="mt-1 text-[13px] text-[#6b7280]">Cổng thông tin đào tạo</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <AuthField
            label="Họ và tên"
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={(event) => handleChange("fullName", event.target.value)}
            required
          />

          <AuthField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            required
          />

          <AuthField
            label="Mật khẩu"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={form.password}
            onChange={(event) => handleChange("password", event.target.value)}
            required
          />

          <div>
            <p className="mb-2 text-[12px] font-medium text-[#4b5563]">Vai trò</p>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((option) => {
                const active = form.role === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange("role", option.value)}
                    aria-pressed={active}
                    className={`h-11 rounded-[4px] border text-[13px] font-medium transition focus:outline-none focus:ring-2 focus:ring-[#00558d]/20 ${
                      active
                        ? "border-[#00558d] bg-[#00558d] text-white shadow-sm"
                        : "border-[#c5cdd6] bg-white text-[#4b5563] hover:border-[#9fb0c3] hover:bg-[#f7f9fc]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <AuthField
            label="Khoa / Bộ môn"
            name="department"
            type="text"
            value={form.department}
            onChange={(event) => handleChange("department", event.target.value)}
          />

          {error ? (
            <div role="alert" className="border-l-4 border-[#c62828] bg-[#fdecea] px-3 py-2.5 text-[13px] leading-5 text-[#8e1b16]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-[4px] bg-[#00558d] text-[14px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-[#004876] focus:outline-none focus:ring-2 focus:ring-[#00558d]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>

        <div className="my-5 h-px w-full bg-[#e4e9f0]" />

        <p className="text-center text-[12px] text-[#5f6f87]">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-[#00558d] hover:underline">
            Đăng nhập
          </Link>
        </p>
        <p className="mt-2 text-center text-[11px] leading-5 text-[#8491a3]">
          Tài khoản quản trị viên do nhà trường cấp.
        </p>
      </div>
    </AuthShell>
  );
}
