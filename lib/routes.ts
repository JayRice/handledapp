import {
  LayoutDashboard,
  Inbox,
  Phone,
  Zap,
  BarChart3,
  Settings,
  LifeBuoy,
  Activity,
  UserX,
  type LucideIcon,
} from "lucide-react"

// ── Route definition types ───────────────────────────
export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
  separator?: boolean
}

// ── Marketing routes ─────────────────────────────────
export const marketingRoutes = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  contact: "/contact",
  demo: "/demo",
} as const

// ── App sidebar nav items ────────────────────────────
export const appNavItems: NavItem[] = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Inbox", href: "/app/inbox", icon: Inbox },
  { label: "Call Log", href: "/app/calls", icon: Phone },
  { label: "Automations", href: "/app/automations", icon: Zap },
  { label: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { label: "Opt-Outs", href: "/app/opt-outs", icon: UserX, separator: true },
  { label: "Settings", href: "/app/settings", icon: Settings },
  { label: "Support", href: "/app/support", icon: LifeBuoy },
  { label: "Status", href: "/app/status", icon: Activity },
]

// ── Settings tab definitions ─────────────────────────
export const settingsTabs = [
  { value: "profile", label: "Profile" },
  { value: "business", label: "Business" },
  { value: "notifications", label: "Notifications" },
  { value: "billing", label: "Billing" },
  { value: "integrations", label: "Integrations" },
  { value: "team", label: "Team" },
  { value: "danger", label: "Danger Zone" },
] as const

export type SettingsTab = (typeof settingsTabs)[number]["value"]

// ── Helpers ──────────────────────────────────────────
export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app"
  return pathname.startsWith(href)
}
