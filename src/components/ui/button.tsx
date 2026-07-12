import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold uppercase tracking-[2px] transition-all focus-visible:outline-none focus-visible:outline-[3px] focus-visible:outline-black focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-[3px] border-black bg-black text-white hover:bg-white hover:text-black active:border-[5px]",
        secondary: "border-[3px] border-black bg-white text-black hover:bg-black hover:text-white",
        ghost: "border-0 bg-transparent text-black underline hover:text-[#0000ff]",
        destructive: "border-[3px] border-black bg-[#ff0000] text-white hover:bg-black hover:text-[#ff0000]",
        outline: "border-[3px] border-black bg-white text-black hover:bg-black hover:text-white",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-8 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-11 w-11",
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
