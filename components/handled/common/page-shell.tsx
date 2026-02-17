import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageShellProps {
  children: ReactNode
  /** Remove padding for full-bleed layouts like inbox */
  fullBleed?: boolean
  className?: string
}

export function PageShell({ children, fullBleed, className }: PageShellProps) {
  return (
    <div className={cn(fullBleed ? "" : "flex flex-col gap-6", className)}>
      {children}
    </div>
  )
}
