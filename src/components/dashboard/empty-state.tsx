import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="relative mb-6">
        <div className="absolute -inset-4 rounded-[1.75rem] border-2 border-dashed border-border" aria-hidden />
        <div className="absolute -right-3 -top-3 h-4 w-4 rounded-full bg-lime" aria-hidden />
        <div className="absolute -bottom-2 -left-3 h-2.5 w-2.5 rounded-full bg-primary/30" aria-hidden />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-lime">
          <Icon className="h-7 w-7" strokeWidth={1.9} />
        </div>
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
