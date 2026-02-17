// ── Typed config getters ─────────────────────────────
// Safe env var access. App does not crash if missing in Dev Mode.

function getEnv(key: string, fallback?: string): string {
  const value = typeof window === "undefined"
    ? process.env[key]
    : (process.env[key] ?? undefined)
  return value ?? fallback ?? ""
}

export const config = {
  supabase: {
    url: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    get isConfigured() {
      return Boolean(this.url && this.anonKey)
    },
  },

  app: {
    baseUrl: getEnv("APP_BASE_URL", "http://localhost:3000"),
    name: "Handled",
  },

  get isProduction() {
    return process.env.NODE_ENV === "production"
  },

  get isDevelopment() {
    return process.env.NODE_ENV === "development"
  },
} as const
