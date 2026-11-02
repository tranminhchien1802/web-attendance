import Image from "next/image";

type AuthShellProps = {
  children: React.ReactNode;
  wide?: boolean;
};

export function AuthShell({ children, wide = false }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#eef2f7] text-[#1f2a37]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_560px]">
        <section className="relative hidden overflow-hidden lg:block" aria-hidden="true">
          <Image
            src="/images/hcmute-campus.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 70vw, 0px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05172e]/95 via-[#0b2d59]/55 to-[#0b2d59]/20" />

          <div className="relative flex h-full flex-col justify-between p-10 text-white xl:p-14">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="PLT Solutions"
                  width={720}
                  height={424}
                  priority
                  className="h-9 w-auto"
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-100/80">HCMUTE</p>
                <p className="text-sm font-medium text-blue-50">Cổng thông tin đào tạo</p>
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-blue-100/80">
                Trường Đại học Công nghệ Kỹ thuật TP.HCM
              </p>
              <h2 className="mt-4 text-4xl font-medium leading-[1.15] text-white xl:text-[46px]">
                Tri thức · Sáng tạo
                <br />
                Kết nối tương lai
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-6 text-blue-100/85">
                Tra cứu lịch học, điểm danh, kết quả học tập và học phí trên một cổng thông tin duy nhất dành cho
                sinh viên, giảng viên và quản trị viên.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-blue-100/60">
              <span>© 2026 HCMUTE. All rights reserved.</span>
              <span>Developed by PSC</span>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen flex-col bg-[#eef2f7]">
          <div className="relative h-36 w-full overflow-hidden sm:h-44 lg:hidden">
            <Image
              src="/images/hcmute-campus.jpg"
              alt="Khuôn viên Trường Đại học Công nghệ Kỹ thuật TP.HCM"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#05172e]/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
              <div className="rounded-lg bg-white/95 px-3 py-2 shadow-lg">
                <Image
                  src="/images/logo.png"
                  alt="PLT Solutions"
                  width={720}
                  height={424}
                  priority
                  className="h-10 w-auto sm:h-12"
                />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-blue-50/90">
                Cổng thông tin đào tạo
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
            <div className={wide ? "w-full max-w-[500px]" : "w-full max-w-[432px]"}>
              <div className="mb-5 hidden flex-col items-center text-center lg:flex">
                <Image
                  src="/images/logo.png"
                  alt="PLT Solutions"
                  width={720}
                  height={424}
                  priority
                  className="h-[92px] w-auto"
                />
                <h1 className="mt-3 text-[15px] font-bold uppercase leading-6 tracking-[0.04em] text-[#0d2461]">
                  Trường Đại học Công nghệ
                  <br />
                  Kỹ thuật TP.HCM
                </h1>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.28em] text-[#6b7a90]">
                  Cổng thông tin đào tạo
                </p>
              </div>

              {children}

              <p className="mt-6 text-center text-[11px] leading-5 text-[#8491a3]">
                All Rights Reserved · Developed by <span className="font-semibold text-[#5b6b82]">PSC</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
