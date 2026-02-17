import { useMemo } from "react"
import { config } from "@/lib/config"
import { MockProvider } from "./mock-provider"
import { SupabaseProvider } from "./supabase-provider"
import type { DataProvider } from "./provider"

// ── Hook: useDataProvider ────────────────────────────
// Single hook that all app pages use to get their data provider.
// Automatically selects MockProvider or SupabaseProvider based on env config.

export function useDataProvider(): DataProvider {
  return useMemo(() => {
    if (config.supabase.isConfigured) {
      return new SupabaseProvider()
    }
    return new MockProvider()
  }, [])
}
