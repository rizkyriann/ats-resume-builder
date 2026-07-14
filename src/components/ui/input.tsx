import * as React from "react"

import { cn } from "@/lib/cn"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "font-body flex h-10 w-full rounded-qu border border-qu-border bg-qu-surface px-3 py-2 text-sm text-qu-text transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-qu-text placeholder:text-qu-text-muted hover:border-qu-gold focus-visible:border-2 focus-visible:border-qu-gold focus-visible:shadow-[0_0_0_3px_rgba(202,138,4,0.25)] focus-visible:outline-none disabled:cursor-not-allowed disabled:border-qu-border-soft disabled:bg-qu-bg disabled:text-qu-text-muted",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
