import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HCMUTE Portal",
  description: "Student portal UI mockup for HCMUTE",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
