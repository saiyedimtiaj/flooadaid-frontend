import type { LucideIcon } from "lucide-react";

interface DashboardWelcomeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function DashboardWelcomeCard({ icon: Icon, title, description, children }: DashboardWelcomeCardProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground">
      <div className="pointer-events-none absolute -right-16 top-1/2 hidden h-72 w-72 -translate-y-1/2 sm:block" aria-hidden>
        <div className="absolute inset-0 rounded-full border border-white/8" />
        <div className="absolute inset-8 rounded-full border border-white/10" />
        <div className="absolute inset-16 rounded-full border border-white/12" />
      </div>
      <div className="pointer-events-none absolute right-12 top-1/2 hidden -translate-y-1/2 sm:flex h-20 w-20 items-center justify-center rounded-2xl bg-lime text-lime-foreground" aria-hidden>
        <Icon className="h-9 w-9" />
      </div>

      <div className="relative px-6 py-7 md:px-8 md:py-8 sm:pr-48">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-xl text-sm md:text-base text-white/70">{description}</p>
        {children && <div className="mt-5">{children}</div>}
      </div>
    </section>
  );
}
