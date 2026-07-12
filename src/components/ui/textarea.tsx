import * as React from "react"

import { cn } from "@/lib/cn"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full border-[3px] border-black bg-[#f0f0f0] px-3 py-2.5 font-mono text-[15px] transition-colors placeholder:text-muted-foreground hover:bg-[#e8e8e8] focus-visible:border-[5px] focus-visible:outline-none disabled:cursor-not-allowed disabled:border-[#ccc] disabled:bg-[#f5f5f5]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
