import * as React from "react"

import { cn } from "@/lib/cn"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "font-body flex min-h-[80px] w-full rounded-qu border border-qu-border bg-qu-surface px-3 py-2 text-sm text-qu-text transition-all placeholder:text-qu-text-muted hover:border-qu-gold focus-visible:border-2 focus-visible:border-qu-gold focus-visible:shadow-[0_0_0_3px_rgba(202,138,4,0.25)] focus-visible:outline-none disabled:cursor-not-allowed disabled:border-qu-border-soft disabled:bg-qu-bg disabled:text-qu-text-muted",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
