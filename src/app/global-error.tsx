"use client"; // Replaces the root layout when it fails, so it renders its own <html>.

import "./globals.css";

export default function GlobalError({ unstable_retry }: { unstable_retry: () => void }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans px-4">
        <div className="max-w-md text-center flex flex-col items-center gap-3">
          <h1 className="text-2xl font-extrabold">FloodAid is having trouble</h1>
          <p className="text-sm text-muted-foreground">
            Please try again. In an emergency call 999.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
