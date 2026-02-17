"use client"

import { X, Info, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { AppBanner, BannerVariant } from "@/types/handled"

const variantConfig: Record<BannerVariant, { icon: typeof Info; bg: string; text: string; border: string }> = {
  info: { icon: Info, bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
  warn: { icon: AlertTriangle, bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  error: { icon: AlertCircle, bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20" },
  success: { icon: CheckCircle2, bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
}

interface BannerProps {
  banner: AppBanner
  onDismiss?: (id: string) => void
}

export function Banner({ banner, onDismiss }: BannerProps) {
  const config = variantConfig[banner.variant]
  const Icon = config.icon

  return (
    <div className={cn("flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-medium border-b", config.bg, config.text, config.border)}>
      <Icon className="h-3 w-3 shrink-0" />
      <span>{banner.message}</span>
      {banner.action && (
        <Link
          href={banner.action.href}
          className="underline underline-offset-2 font-semibold hover:opacity-80"
        >
          {banner.action.label}
        </Link>
      )}
      {banner.dismissible && onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-4 w-4 ml-1 hover:bg-transparent", config.text)}
          onClick={() => onDismiss(banner.id)}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Dismiss</span>
        </Button>
      )}
    </div>
  )
}

interface BannerStackProps {
  banners: AppBanner[]
  onDismiss: (id: string) => void
}

export function BannerStack({ banners, onDismiss }: BannerStackProps) {
  if (banners.length === 0) return null
  return (
    <div className="flex flex-col">
      {banners.map((b) => (
        <Banner key={b.id} banner={b} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
