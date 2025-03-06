import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Play } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const play = Play({
  weight: ['400', '700'],
  subsets: ['cyrillic'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
})

export const metadata: Metadata = {
  title: "AltaiLand - Земельные участки в Алтае",
  description: "Продажа земельных участков в живописных местах Алтая",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${plusJakartaSans.variable} ${inter.variable} ${play.className}`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
