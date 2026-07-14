import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-body group-[.toaster]:bg-qu-surface-raised group-[.toaster]:text-qu-text group-[.toaster]:border group-[.toaster]:border-qu-gold/40 group-[.toaster]:rounded-qu group-[.toaster]:shadow-qu-md",
          description: "group-[.toast]:text-qu-text-muted",
          actionButton:
            "group-[.toast]:bg-qu-gold group-[.toast]:text-qu-bg",
          cancelButton:
            "group-[.toast]:bg-qu-surface group-[.toast]:text-qu-text-muted",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
