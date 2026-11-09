import Image from "next/image";
import { CalendarDays, CheckCheck, GraduationCap } from "lucide-react";

type AuthShellProps = {
  children: React.ReactNode;
  wide?: boolean;
};

const companyName = "Công ty trách nhiệm hữu hạn Phan Gia Phước";

export function AuthShell({ children, wide = false }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#eef2f7] text-[#1f2a37]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_560px]">
        <section className="auth-brand-panel relative hidden overflow-hidden bg-gradient-to-br from-[#0b2850] via-[#10518a] to-[#1676a3] lg:block">
          <div aria-hidden="true" className="auth-orbit auth-orbit-one" />
          <div aria-hidden="true" className="auth-orbit auth-orbit-two" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white xl:p-14">
            <div className="auth-enter flex items-center gap-3">
              <div className="auth-logo-float rounded-xl bg-white px-3 py-2 shadow-lg shadow-slate-950/15">
                <Image src="/images/logo.png" alt="Logo công ty" width={720} height={424} priority className="h-10 w-auto" />
              </div>
              <div className="max-w-[260px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100/75">Cổng thông tin đào tạo</p>
                <p className="mt-1 text-sm font-semibold leading-5 text-white">{companyName}</p>
              </div>
            </div>

            <div className="auth-enter auth-enter-delayed max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-blue-50 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
                Nền tảng học tập và giảng dạy
              </span>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-[48px]">
                Học tập vững vàng.
                <br />
                Giảng dạy hiệu quả.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-blue-100/85">
                Theo dõi lịch học, lớp giảng dạy, điểm danh và kết quả học tập trên một cổng đào tạo thống nhất dành cho sinh viên và giảng viên.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5 text-xs font-medium text-white/90">
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-sm"><CalendarDays className="h-4 w-4 text-cyan-200" />Thời khóa biểu</span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-sm"><CheckCheck className="h-4 w-4 text-emerald-200" />Điểm danh trực tuyến</span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-sm"><GraduationCap className="h-4 w-4 text-amber-200" />Theo dõi học tập</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-[10px] text-blue-100/60">
              <span>© 2026 Công ty TNHH Phan Gia Phước</span>
              <span>Cổng đào tạo nội bộ</span>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen flex-col bg-[#f3f6fa]">
          <div className="auth-mobile-banner relative flex min-h-[170px] w-full flex-col items-center justify-center overflow-hidden px-5 py-5 text-center lg:hidden">
            <div aria-hidden="true" className="auth-orbit auth-orbit-mobile" />
            <div className="auth-logo-float relative rounded-xl bg-white px-3 py-2 shadow-lg shadow-slate-950/15">
              <Image src="/images/logo.png" alt="Logo công ty" width={720} height={424} priority className="h-10 w-auto" />
            </div>
            <p className="relative mt-3 text-[10px] font-bold uppercase tracking-[0.13em] text-blue-100">Cổng thông tin đào tạo</p>
            <p className="relative mt-1 text-xs font-semibold text-white">Công ty TNHH Phan Gia Phước</p>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
            <div className={wide ? "auth-enter w-full max-w-[500px]" : "auth-enter w-full max-w-[432px]"}>
              <div className="mb-5 hidden flex-col items-center text-center lg:flex">
                <div className="auth-logo-float rounded-2xl bg-white p-3 shadow-[0_12px_35px_rgba(15,49,89,0.12)] ring-1 ring-slate-200/70">
                  <Image src="/images/logo.png" alt="Logo công ty" width={720} height={424} priority className="h-[82px] w-auto" />
                </div>
                <h1 className="mt-4 max-w-[390px] text-[15px] font-bold leading-6 tracking-[0.02em] text-[#0d3159]">{companyName}</h1>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6b7a90]">Cổng thông tin đào tạo</p>
              </div>

              {children}

              <p className="mt-6 text-center text-[10px] leading-5 text-[#8491a3]">© 2026 Công ty TNHH Phan Gia Phước · Cổng đào tạo nội bộ</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
