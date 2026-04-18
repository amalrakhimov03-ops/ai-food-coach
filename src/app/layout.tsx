import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "AI Food Coach - Персональный AI-ассистент по питанию",
  description: "Умный AI-ассистент для контроля питания через Telegram и Web App. Отправляй еду текстом или голосом, получай анализ, советы и историю.",
  keywords: ["AI", "питание", "здоровье", "калории", "диета", "фитнес", "telegram bot"],
  authors: [{ name: "AI Food Coach" }],
  openGraph: {
    title: "AI Food Coach - Персональный AI-ассистент по питанию",
    description: "Умный AI-ассистент для контроля питания. Анализ еды, подсчёт калорий и персональные рекомендации.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased bg-background`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
