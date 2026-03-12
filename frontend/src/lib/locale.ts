"use client";

export type Locale = "en" | "th";

export function getLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
  const value = match ? decodeURIComponent(match[1]) : "en";
  return value === "th" ? "th" : "en";
}

export function setLocale(locale: Locale): void {
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `locale=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
