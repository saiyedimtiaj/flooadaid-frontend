"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Provides `useTheme()` to the maps and toaster. The UI is designed light-first,
 * so light stays the default; the `.dark` styles in globals.css still apply if
 * a user's theme is switched.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
