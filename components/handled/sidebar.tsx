"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/AuthProvider"
import { useAppStore } from "@/lib/store/app-store"
import { appNavItems, isActiveRoute } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Phone, ChevronLeft, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname()
  const { user, profile, organization } = useAuth()
  const usage = useAppStore((s) => s.usage)
  const billing = useAppStore((s) => s.billing)
  const smsPercent = Math.round((usage?.sms_used || 0 / 300) * 100)

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card/50 transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-3 py-4">
        {!collapsed && (
          <Link href="/app" className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Phone className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">Handled</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/app" className="mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Phone className="h-4 w-4 text-primary-foreground" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("shrink-0 h-7 w-7 text-muted-foreground", collapsed && "hidden")}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Org badge */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
          <p className="truncate text-sm font-medium text-foreground">{organization?.name || "My Business"}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-[10px] px-1.5 py-0">
              {billing?.plan === "pro" ? "Pro" : billing?.plan === "enterprise" ? "Enterprise" : "Trial"}
            </Badge>
            {billing?.plan === "trial" && (
              <span className="text-[10px] text-muted-foreground">14 days left</span>
            )}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2" aria-label="Main navigation">
        <ul className="flex flex-col gap-1" role="list">
          {appNavItems.map((item, idx) => (
            <li key={item.href}>
              {item.separator && idx > 0 && (
                <div className="my-2 h-px bg-border" role="separator" />
              )}
              <Link
                href={item.href}
                aria-current={isActiveRoute(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActiveRoute(pathname, item.href)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge && (
                  <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Usage indicator */}
      {!collapsed && (
        <div className="mx-3 mb-4 rounded-lg border border-border bg-muted/30 px-3 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>SMS used</span>
            <span>{usage?.sms_used} / 300</span>
          </div>
          <Progress
            value={smsPercent}
            className={cn("mt-2 h-1.5", smsPercent >= 80 && "[&>div]:bg-amber-500")}
          />
        </div>
      )}

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="mb-4 flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-7 w-7 text-muted-foreground"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </aside>
  )
}
