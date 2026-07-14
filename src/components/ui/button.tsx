import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/cn"

const buttonVariants = cva(
  "font-headline inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-qu font-medium uppercase tracking-[1px] transition-all focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-qu-gold focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-35 disabled:shadow-none",
  {
    variants: {
      variant: {
        default:
          "border border-qu-gold-bright bg-qu-gold text-qu-bg shadow-qu-sm hover:bg-qu-gold-deep hover:shadow-qu-glow disabled:border-qu-border",
        secondary:
          "border border-qu-gold bg-transparent text-qu-gold hover:bg-qu-gold/[0.08] hover:shadow-qu-sm disabled:border-qu-border",
        ghost:
          "border-0 bg-transparent text-qu-text-muted hover:bg-qu-surface-raised hover:text-qu-text",
        destructive:
          "border border-qu-red-bright bg-qu-red text-qu-text shadow-qu-sm hover:bg-qu-red-deep disabled:border-qu-border",
        outline:
          "border border-qu-gold bg-transparent text-qu-gold hover:bg-qu-gold/[0.08] hover:shadow-qu-sm disabled:border-qu-border",
      },
      size: {
        default: "h-10 px-[22px] text-sm",
        sm: "h-8 px-[14px] text-[13px]",
        lg: "h-12 px-[30px] text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
