import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionTone = "blue" | "red" | "green" | "amber" | "violet" | "cyan";

const TONES: Record<ActionTone, string> = {
  blue: "bg-sky-500/10 text-sky-700",
  red: "bg-destructive/10 text-destructive",
  green: "bg-emerald-500/10 text-emerald-700",
  amber: "bg-amber-500/12 text-amber-700",
  violet: "bg-violet-500/10 text-violet-700",
  cyan: "bg-teal-500/10 text-teal-700",
};

interface ActionTileProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: ActionTone;
}

export function ActionTile({ href, icon: Icon, title, description, tone = "blue" }: ActionTileProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lift"
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", TONES[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-lime">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
