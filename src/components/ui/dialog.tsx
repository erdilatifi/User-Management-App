import * as React from "react"
import { createPortal } from "react-dom"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type DialogContextValue = {
  open: boolean
  onOpenChange?: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function Dialog({
  open = false,
  onOpenChange,
  children,
  ...props
}: { open?: boolean; onOpenChange?: (open: boolean) => void } & React.ComponentProps<"div">) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <div data-slot="dialog" {...props}>{children}</div>
    </DialogContext.Provider>
  )
}

function useDialog() {
  const ctx = React.useContext(DialogContext)
  if (!ctx) throw new Error("Dialog components must be used inside <Dialog>")
  return ctx
}

function DialogPortal({ children }: { children?: React.ReactNode }) {
  if (typeof document === "undefined") return null
  return createPortal(<div data-slot="dialog-portal">{children}</div>, document.body)
}

function DialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  const { open, onOpenChange } = useDialog()
  if (!open) return null
  return (
    <div
      data-slot="dialog-overlay"
      onClick={() => onOpenChange?.(false)}
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<"div"> & { showCloseButton?: boolean }) {
  const { open, onOpenChange } = useDialog()
  if (!open) return null

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        role="dialog"
        aria-modal="true"
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <button
            type="button"
            onClick={() => onOpenChange?.(false)}
            data-slot="dialog-close"
            className="absolute right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function DialogClose(props: React.ComponentProps<"button">) {
  const { onOpenChange } = useDialog()
  return (
    <button
      type="button"
      data-slot="dialog-close"
      onClick={() => onOpenChange?.(false)}
      {...props}
    />
  )
}

function DialogTrigger(props: React.ComponentProps<"button">) {
  const { onOpenChange } = useDialog()
  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      onClick={() => onOpenChange?.(true)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}