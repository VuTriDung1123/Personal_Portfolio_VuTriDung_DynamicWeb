import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClientWrapper from "@/components/ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VuTriDung's Portfolio",
  description: "Portfolio cá nhân của Vũ Trí Dũng - Web Developer & Blockchain Enthusiast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: Bắt buộc phải có để tránh lỗi khi dùng next-themes
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 1. Nhúng phần nền động và nút bấm vào đây */}
          <ClientWrapper />

          {/* 2. Nội dung chính của web (Đặt z-10 để nổi lên trên nền Matrix) */}
          <div className="relative z-10 min-h-screen text-gray-900 dark:text-[#00ff41] font-sans dark:font-mono">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}