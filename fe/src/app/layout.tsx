import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "Cổng đào tạo | CÔNG TY TNHH PLT SOLUTIONS",
  description: "Cổng thông tin đào tạo của CÔNG TY TNHH PLT SOLUTIONS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
