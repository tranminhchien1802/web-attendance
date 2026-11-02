import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HCMUTE Portal | Cổng thông tin đào tạo",
  description: "Cổng thông tin đào tạo Trường Đại học Công nghệ Kỹ thuật TP.HCM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={roboto.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
