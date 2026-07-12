import * as React from "react"

import { cn } from "@/lib/cn"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-auto w-full border-[3px] border-black bg-[#f0f0f0] px-3 py-2.5 font-mono text-[15px] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:bg-[#e8e8e8] focus-visible:border-[5px] focus-visible:outline-none disabled:cursor-not-allowed disabled:border-[#ccc] disabled:bg-[#f5f5f5]",
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
