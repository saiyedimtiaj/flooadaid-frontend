import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-muted text-muted-foreground/60 mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
