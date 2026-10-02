import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.scss";

const pretendard = localFont({
  src: [
    {
      path: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
      weight: "100 900",
      style: "normal"
    }
  ],
  variable: "--font-pretendard",
  display: "swap"
});

export const metadata: Metadata = {
  title: "박현규 — Frontend · UI Engineer"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={pretendard.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
