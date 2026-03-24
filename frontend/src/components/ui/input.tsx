import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn("relative flex items-center h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 py-1 outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50", className)}
      {...props}
    />
  )
}

function InputGroupButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      className={cn("pointer-events-auto", className)}
      {...props}
    />
  )
}

function InputGroupAddon({ className, align, ...props }: React.ComponentProps<"div"> & { align?: "block-start" | "block-end" }) {
  return (
    <div
      data-slot="input-group-addon"
      className={cn("flex w-full items-center gap-2 min-w-0", className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn("flex-1 truncate select-all min-w-0 text-foreground", className)}
      {...props}
    />
  )
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input-group-textarea"
      className={cn(
        "flex min-h-[80px] w-full resize-none bg-transparent p-0 text-base transition-colors outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input, InputGroup, InputGroupButton, InputGroupAddon, InputGroupText, InputGroupTextarea }
