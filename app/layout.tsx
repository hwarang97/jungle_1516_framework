import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 노트북 구매 보조",
  description: "노트북 상품 검색과 비교를 돕는 MVP 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="site-header">
          <Link className="site-brand" href="/">
            AI 노트북 구매 보조
          </Link>
          <nav className="site-nav" aria-label="주요 메뉴">
            <Link href="/products">상품 목록</Link>
            <Link href="/products/new">상품 등록</Link>
            <Link href="/login">로그인</Link>
            <Link className="site-nav-primary" href="/signup">
              회원가입
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
