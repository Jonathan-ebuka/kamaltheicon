"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"       // adds/removes the "dark" class on <html>
      defaultTheme="system"   // follows OS preference by default
      enableSystem            // listens for OS preference changes
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
