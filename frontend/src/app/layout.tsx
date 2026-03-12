import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";

import { DM_Serif_Display, IBM_Plex_Sans, Sarabun, Sora } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GlobalLoader } from "@/components/ui/global-loader";

export const metadata: Metadata = {
  title: "OpenClaw Mission Control",
  description: "A calm command center for every task.",
};

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const headingFont = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

const displayFont = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400"],
});

const thaiFont = Sarabun({
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-thai",
  weight: ["400", "500", "600", "700"],
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const validLocale = ["en", "th"].includes(locale) ? locale : "en";

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const messages = (await import(`../../messages/${validLocale}.json`)).default;

  return (
    <html lang={validLocale} suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} ${headingFont.variable} ${displayFont.variable} ${thaiFont.variable} min-h-screen bg-app text-strong antialiased`}
        style={validLocale === "th" ? { fontFamily: "var(--font-thai), var(--font-body), sans-serif" } : undefined}
      >
        <ThemeProvider>
          <NextIntlClientProvider locale={validLocale} messages={messages}>
            <AuthProvider>
              <QueryProvider>
                <GlobalLoader />
                {children}
              </QueryProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
