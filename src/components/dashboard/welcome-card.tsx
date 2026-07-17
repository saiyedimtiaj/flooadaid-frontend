import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardWelcomeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function DashboardWelcomeCard({
  icon: Icon,
  title,
  description,
  children,
}: DashboardWelcomeCardProps) {
  return (
    <Card className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-extrabold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-md">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </Card>
  );
}
