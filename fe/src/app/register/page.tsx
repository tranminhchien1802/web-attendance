import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell>
      <section className="rounded-[8px] border border-[#dfe5ec] bg-white p-6 text-center shadow-[0_20px_60px_rgba(8,30,60,0.12)] sm:p-8">
        <h1 className="text-xl font-semibold text-[#0d2461]">Tài khoản do quản trị viên cấp</h1>
        <p className="mt-3 text-sm leading-6 text-[#5f6f87]">
          Sinh viên và giảng viên vui lòng liên hệ quản trị viên để tạo hoặc cập nhật tài khoản.
        </p>
        <Link href="/login" className="mt-6 inline-flex h-11 items-center justify-center rounded-[4px] bg-[#00558d] px-5 text-sm font-semibold text-white transition hover:bg-[#004876]">
          Quay lại đăng nhập
        </Link>
      </section>
    </AuthShell>
  );
}
