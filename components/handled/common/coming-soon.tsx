"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import type { ReactNode } from "react"

interface ComingSoonButtonProps {
  children: ReactNode
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
  className?: string
}

export function ComingSoonButton({ children, variant = "outline", size = "sm", className }: ComingSoonButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`opacity-50 cursor-not-allowed ${className ?? ""}`}
            onClick={(e) => {
              e.preventDefault()
              toast.info("Coming soon! This feature is not available yet.")
            }}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Coming soon</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
