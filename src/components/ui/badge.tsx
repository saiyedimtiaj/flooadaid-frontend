import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        danger: "bg-destructive/10 text-destructive",
        warning:
          "bg-amber-500/10 text-amber-600 dark:text-amber-500",
        success:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
        info: "bg-info/10 text-info",
        primary: "bg-primary/10 text-primary",
        neutral: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

const dotVariants = cva("size-1.5 rounded-full animate-pulse-soft", {
  variants: {
    variant: {
      danger: "bg-destructive",
      warning: "bg-amber-500",
      success: "bg-emerald-500",
      info: "bg-info",
      primary: "bg-primary",
      neutral: "bg-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className={dotVariants({ variant })} />}
      {children}
    </span>
  );
}
