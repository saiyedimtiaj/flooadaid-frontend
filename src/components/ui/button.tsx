import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button cursor-pointer inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {

    
    variants: {
      variant: {
        default:
          "bg-linear-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_18%)] text-primary-foreground shadow-sm hover:brightness-110 active:brightness-95",
        outline:
          "border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",

        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",

        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",

        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/85 active:bg-destructive/90 focus-visible:ring-destructive/50",

        "destructive-outline":
          "border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:border-destructive/40 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/10 dark:hover:bg-destructive/20 dark:border-destructive/40",

        warning:
          "bg-warning text-warning-foreground shadow-sm hover:bg-warning/85 active:bg-warning/90 focus-visible:ring-warning/50",

        "warning-outline":
          "border-warning/30 bg-warning/5 text-warning hover:bg-warning/10 hover:border-warning/40 focus-visible:border-warning/40 focus-visible:ring-warning/20 dark:text-[oklch(0.82_0.16_55.934)] dark:bg-warning/10 dark:hover:bg-warning/20",

        success:
          "bg-success text-success-foreground shadow-sm hover:bg-success/85 active:bg-success/90 focus-visible:ring-success/50",

        "success-outline":
          "border-success/30 bg-success/5 text-success hover:bg-success/10 hover:border-success/40 focus-visible:border-success/40 focus-visible:ring-success/20 dark:text-[oklch(0.75_0.145_163.225)] dark:bg-success/10 dark:hover:bg-success/20",

        info:
          "bg-info text-info-foreground shadow-sm hover:bg-info/85 active:bg-info/90 focus-visible:ring-info/50",

        "info-outline":
          "border-info/30 bg-info/5 text-info hover:bg-info/10 hover:border-info/40 focus-visible:border-info/40 focus-visible:ring-info/20 dark:text-[oklch(0.72_0.145_236.824)] dark:bg-info/10 dark:hover:bg-info/20",

        sos:
          "bg-destructive text-destructive-foreground font-bold shadow-[0_0_0_4px_oklch(0.577_0.245_27.325/0.25)] hover:shadow-[0_0_0_6px_oklch(0.577_0.245_27.325/0.2)] hover:brightness-110 active:scale-[0.98] focus-visible:ring-destructive/50",

        glass:
          "bg-background/60 backdrop-blur-xl border-border/50 text-foreground shadow-sm hover:bg-background/80 hover:border-border dark:bg-background/40 dark:hover:bg-background/60",

        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 gap-1.5 px-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xl: "h-12 gap-2 rounded-xl px-6 text-base font-semibold",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        "full": "h-12 w-full gap-2 rounded-xl px-6 text-base font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  isLoading = false,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }