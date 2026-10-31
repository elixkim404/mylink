import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "김예현 | 마이링크",
  description: "코딩이 재미있는 컴퓨터공학과 1학년 새내기 김예현의 프로필이에요.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F2F4F6] text-[#191F28] selection:bg-[#3182F6] selection:text-white">
        {children}
      </body>
    </html>
  );
}
