import "./globals.css";
import "./portal.css";
import type { Metadata } from "next";
import { PortalProviders } from "@/components/PortalProviders";

export const metadata: Metadata = {
  title: "Cổng đào tạo | CÔNG TY TNHH PLT SOLUTIONS",
  description: "Cổng thông tin đào tạo của CÔNG TY TNHH PLT SOLUTIONS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased"><PortalProviders>{children}</PortalProviders></body>
    </html>
  );
}
