import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://elixkim404.github.io/mylink/"
  ),
  title: "마이링크 | 나만의 퍼블릭 링크 & 프로필",
  description: "구글 로그인으로 간편하게 시작하는 나만의 링크 인 바이오 서비스",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

