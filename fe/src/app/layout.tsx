import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "Cổng đào tạo | Công ty trách nhiệm hữu hạn Phan Gia Phước",
  description: "Cổng thông tin đào tạo của Công ty trách nhiệm hữu hạn Phan Gia Phước",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
