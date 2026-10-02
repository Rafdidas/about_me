import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteMeta } from "@/data/site";
import { themeInitScript } from "@/lib/theme";
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
  metadataBase: new URL(siteMeta.url),
  title: { default: siteMeta.title, template: `%s | ${siteMeta.title}` },
  description: siteMeta.description,
  openGraph: { title: siteMeta.title, description: siteMeta.description, type: "website", url: siteMeta.url }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={pretendard.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
