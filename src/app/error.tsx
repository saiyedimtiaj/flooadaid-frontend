"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 min-h-[60vh] items-center justify-center px-4 py-24">
      <div className="max-w-md text-center flex flex-col items-center gap-4">
        <div className="flex items-center justify-center size-14 rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          This page failed to load. If you need rescue right now, the SOS form and the 999 hotline still work.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <Button variant="outline" className="gap-2" onClick={() => unstable_retry()}>
            <RotateCcw className="size-4" />
            Try again
          </Button>
          <Button variant="destructive" className="gap-2" nativeButton={false} render={<Link href="/sos" />}>
            <Siren className="size-4" />
            Emergency SOS
          </Button>
        </div>
      </div>
    </div>
  );
}
