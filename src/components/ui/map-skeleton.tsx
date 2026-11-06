import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function MapSkeleton({ className, label = "Loading map…" }: { className?: string; label?: string }) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden rounded-[inherit] bg-muted", className)}>
      <div className="absolute inset-0 animate-pulse bg-[linear-gradient(to_right,oklch(0.3_0.06_165/0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.3_0.06_165/0.06)_1px,transparent_1px)] bg-size-[40px_40px]" />
      <svg className="absolute inset-0 h-full w-full text-border" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden>
        <path d="M0 210 C 80 180, 140 240, 220 200 S 340 150, 400 170" fill="none" stroke="currentColor" strokeWidth="6" />
        <path d="M60 0 C 90 80, 70 160, 120 300" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
      {[
        "left-[22%] top-[30%]",
        "left-[58%] top-[42%]",
        "left-[40%] top-[64%]",
        "left-[74%] top-[22%]",
      ].map((pos, i) => (
        <MapPin
          key={pos}
          className={cn("absolute h-6 w-6 animate-bounce text-primary/30", pos)}
          style={{ animationDelay: `${i * 150}ms`, animationDuration: "1.6s" }}
        />
      ))}
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm ring-1 ring-border">
        {label}
      </span>
    </div>
  );
}
