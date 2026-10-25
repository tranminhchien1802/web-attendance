"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginWithCredentials } from "@/lib/auth";

const demoAccounts = [
  { email: "student@hcmute.edu.vn", password: "123456", label: "Sinh viên" },
  { email: "teacher@hcmute.edu.vn", password: "123456", label: "Giảng viên" },
  { email: "admin@hcmute.edu.vn", password: "123456", label: "Admin" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("student@hcmute.edu.vn");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
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

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#dfe3e6] px-4 py-8 text-[#1d2b3a]">
      <div className="w-full max-w-[440px] animate-fade-up">
        <div className="mb-4 flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex h-[60px] w-[60px] items-center justify-center rounded-full border-[5px] border-[#0d4d90] bg-white shadow-[0_8px_20px_rgba(13,77,144,0.16)]">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full border-[3px] border-[#d72638] bg-white text-[22px] font-black text-[#0d4d90]">
              H
            </div>
          </div>

          <div className="text-[30px] font-black leading-none tracking-tight text-[#0d4d90]">HCM-UTE</div>
          <div className="mt-3 text-[18px] font-black uppercase leading-[1.25] tracking-[0.04em] text-[#0d4d90]">
            Trường Đại học Công nghệ Kỹ thuật
            <div className="mt-1">TP.HCM</div>
          </div>
        </div>

        <div className="rounded-[8px] border border-[#d3dbe3] bg-[#f0f0f0] p-5 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
          <div className="mb-4 text-center">
            <h1 className="text-[22px] font-black uppercase tracking-[0.04em] text-[#0d4d90]">Đăng nhập</h1>
            <p className="mt-2 text-[12px] text-[#6d7887]">Cổng thông tin đào tạo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Tên đăng nhập"
              className="w-full rounded-[5px] border border-[#bfd0ea] bg-white px-3 py-3 text-[14px] text-[#1f2a37] outline-none transition focus:border-[#0d4d90] focus:ring-4 focus:ring-[#dfeeff]"
              required
            />

            <div className="relative">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                className="w-full rounded-[5px] border border-[#bfd0ea] bg-white px-3 py-3 pr-11 text-[14px] text-[#1f2a37] outline-none transition focus:border-[#0d4d90] focus:ring-4 focus:ring-[#dfeeff]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] transition hover:text-[#1f2a37]"
                aria-label="show password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error ? (
              <div className="rounded-[5px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[5px] bg-[#0d4d90] px-4 py-3 text-[15px] font-bold text-white transition duration-200 hover:bg-[#0b447d] active:translate-y-[1px] disabled:opacity-60"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => fillDemo(account.email, account.password)}
                className="flex w-full items-center justify-center gap-3 rounded-[5px] border border-[#cfd8e3] bg-white px-4 py-3 text-[13px] font-semibold text-[#1d2b3a] transition hover:border-[#9bb9eb] hover:bg-[#f6faff]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#db4437] text-[11px] font-black text-white">G</span>
                Đăng nhập với Google {account.label}
              </button>
            ))}
          </form>

          <div className="mt-4 text-center text-[12px] text-[#5f6f87]">
            <Link href="/register" className="font-semibold text-[#0d4d90] transition hover:underline">
              Quên mật khẩu
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
