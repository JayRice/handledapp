// ── Handled Brand Tokens ─────────────────────────────
// All color references use CSS custom properties defined in globals.css
// so they automatically adapt to light/dark mode.

export const brand = {
  name: "Handled",
  tagline: "Missed Calls, Handled.",
  description: "Automatically text back missed callers, capture the job, and keep your schedule full.",

  // CSS custom property references (use with var())
  colors: {
    primary: "var(--primary)",
    primaryForeground: "var(--primary-foreground)",
    emerald: "var(--emerald)",
    emeraldMuted: "var(--emerald-muted)",
    emeraldGlow: "var(--emerald-glow)",
  },

  // Gradient tokens for reuse across marketing + app
  gradients: {
    heroGlow: "radial-gradient(ellipse 50% 80% at 50% -20%, var(--emerald-glow), transparent)",
    cardShine: "linear-gradient(135deg, var(--emerald-muted), transparent 60%)",
    ctaGlow: "radial-gradient(ellipse at center, var(--emerald-glow) 0%, transparent 70%)",
  },

  // Spacing constants for consistent layout
  spacing: {
    pageInline: "px-4 lg:px-6",
    pageBlock: "py-4 lg:py-6",
    sectionGap: "gap-6",
    cardGap: "gap-4",
  },
} as const

// ── Badge variant map ────────────────────────────────
// Maps status keys to Tailwind class strings for consistent badge styling
export const statusBadgeClasses: Record<string, string> = {
  // Conversation statuses
  new: "bg-primary/10 text-primary border-primary/30",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  booked: "bg-primary/10 text-primary border-primary/30",
  lost: "bg-muted text-muted-foreground border-border",
  spam: "bg-destructive/10 text-destructive border-destructive/30",
  opted_out: "bg-muted text-muted-foreground border-border",

  // Call follow-up statuses
  "auto-sms": "bg-primary/10 text-primary border-primary/20",
  pending: "text-amber-500 border-amber-500/30",
  replied: "bg-primary/10 text-primary border-primary/20",

  // Billing statuses
  active: "bg-primary/10 text-primary border-primary/30",
  paused: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  canceled: "bg-destructive/10 text-destructive border-destructive/30",
  past_due: "bg-destructive/10 text-destructive border-destructive/30",

  // System health
  operational: "bg-primary/10 text-primary border-primary/30",
  degraded: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  outage: "bg-destructive/10 text-destructive border-destructive/30",
  maintenance: "bg-blue-500/10 text-blue-500 border-blue-500/30",

  // Ticket priorities
  low: "bg-muted text-muted-foreground border-border",
  medium: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  high: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  urgent: "bg-destructive/10 text-destructive border-destructive/30",
} as const

// ── Status label map ─────────────────────────────────
export const statusLabels: Record<string, string> = {
  new: "New",
  in_progress: "In Progress",
  booked: "Booked",
  lost: "Lost",
  spam: "Spam",
  opted_out: "Opted Out",
  active: "Active",
  paused: "Paused",
  canceled: "Canceled",
  past_due: "Past Due",
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
  maintenance: "Maintenance",
} as const
