"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { loginWithCredentials } from "@/lib/auth";

const demoAccounts = {
  student: { email: "student@hcmute.edu.vn", password: "123456", label: "sinh viên" },
  teacher: { email: "teacher@hcmute.edu.vn", password: "123456", label: "giảng viên" },
  admin: { email: "admin@hcmute.edu.vn", password: "123456", label: "quản trị viên" },
};

const googleButtonClass =
  "flex min-h-12 w-full items-center justify-center gap-2.5 rounded-[4px] border border-[#c5cdd6] bg-white px-4 py-2.5 text-center text-[13px] font-medium leading-5 text-[#3c4043] transition hover:border-[#9fb0c3] hover:bg-[#f7f9fc] focus:outline-none focus:ring-2 focus:ring-[#00558d]/20";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(demoAccounts.student.email);
  const [password, setPassword] = useState(demoAccounts.student.password);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    const user = loginWithCredentials(email, password);
    if (!user) {
      setError("Email hoặc mật khẩu không đúng.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    setLoading(false);
  };

  const fillDemo = (account: keyof typeof demoAccounts) => {
    const demo = demoAccounts[account];
    setEmail(demo.email);
    setPassword(demo.password);
    setError("");
    setNotice(`Đã điền tài khoản demo ${demo.label}. Nhấn "Đăng nhập" để tiếp tục.`);
  };

  const handleForgotPassword = () => {
    setError("");
    setNotice("Vui lòng liên hệ Phòng Đào tạo hoặc Trung tâm Thông tin – Máy tính để được cấp lại mật khẩu.");
  };

  return (
    <AuthShell>
      <div className="rounded-[8px] border border-[#dfe5ec] bg-white p-5 shadow-[0_20px_60px_rgba(8,30,60,0.12)] sm:p-7">
        <div className="text-center">
          <h2 className="text-[22px] font-medium uppercase tracking-[0.08em] text-[#0d2461]">Đăng nhập</h2>
          <p className="mt-1 text-[13px] text-[#6b7280]">Cổng thông tin đào tạo</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <AuthField
            label="Tên đăng nhập"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <div className="relative">
            <AuthField
              label="Mật khẩu"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#6b7280] transition hover:text-[#0d2461] focus:outline-none focus:ring-2 focus:ring-[#00558d]/20"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error ? (
            <div role="alert" className="border-l-4 border-[#c62828] bg-[#fdecea] px-3 py-2.5 text-[13px] leading-5 text-[#8e1b16]">
              {error}
            </div>
          ) : null}

          {notice ? (
            <div role="status" className="border-l-4 border-[#00558d] bg-[#eaf2f9] px-3 py-2.5 text-[13px] leading-5 text-[#0d3f66]">
              {notice}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-[4px] bg-[#00558d] text-[14px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-[#004876] focus:outline-none focus:ring-2 focus:ring-[#00558d]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <button type="button" onClick={() => fillDemo("student")} className={googleButtonClass}>
            <GoogleIcon />
            Đăng nhập với Google Sinh viên
          </button>

          <button type="button" onClick={() => fillDemo("teacher")} className={googleButtonClass}>
            <GoogleIcon />
            Đăng nhập với Google Giảng viên
          </button>
        </form>

        <div className="my-5 h-px w-full bg-[#e4e9f0]" />

        <div className="flex flex-col items-center gap-2 text-center text-[12px] text-[#5f6f87]">
          <button type="button" onClick={handleForgotPassword} className="font-medium text-[#00558d] hover:underline">
            Quên mật khẩu?
          </button>
          <p>
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-semibold text-[#00558d] hover:underline">
              Đăng ký ngay
            </Link>
          </p>
          <button type="button" onClick={() => fillDemo("admin")} className="text-[11px] text-[#8491a3] transition hover:text-[#00558d]">
            Tài khoản admin demo
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
