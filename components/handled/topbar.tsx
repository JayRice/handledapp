"use client"

import { useAuth } from "@/lib/auth-context"
import { useDevMode } from "@/components/handled/providers/dev-mode-provider"
import { useAppStore } from "@/lib/store/app-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/handled/theme-toggle"
import { Search, Bell, PanelLeft, User, CreditCard, LogOut, Code2 } from "lucide-react"
import Link from "next/link"

interface TopbarProps {
  onMobileMenuToggle: () => void
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const { user, signOut } = useAuth()
  const { devMode, setDevMode, isDev } = useDevMode()
  const conversations = useAppStore((s) => s.conversations)
  const unreadCount = conversations.filter((c) => c.unread).length
  const initials = user?.name?.slice(0, 2).toUpperCase() || "U"

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card/50 px-4">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-8 w-8 text-muted-foreground"
        onClick={onMobileMenuToggle}
        aria-label="Toggle navigation menu"
      >
        <PanelLeft className="h-4 w-4" />
      </Button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search conversations, contacts..."
          className="pl-9 h-9 bg-muted/30 border-border/50"
          aria-label="Search"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Dev mode toggle - only visible in development */}
        {isDev && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-2.5 py-1.5">
            <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Dev</span>
            <Switch
              checked={devMode}
              onCheckedChange={setDevMode}
              className="h-4 w-7 data-[state=checked]:bg-primary [&>span]:h-3 [&>span]:w-3"
              aria-label="Toggle dev mode"
            />
            {devMode && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
                ON
              </Badge>
            )}
          </div>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground" aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}>
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" aria-label="User menu">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/app/settings" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile & Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app/settings?tab=billing" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
