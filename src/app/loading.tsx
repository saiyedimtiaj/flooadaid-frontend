import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
