// ── Feature Flags ────────────────────────────────────
// Lightweight feature flag system. Flip these when features are ready.
// In production, these could be replaced with a remote flag service.

export const flags = {
  /** Show AI-assisted reply UI in inbox composer */
  enableAIUI: true,

  /** Show Teams tab in settings */
  enableTeamsUI: true,

  /** Show Integrations tab in settings */
  enableIntegrationsUI: false,

  /** Show API Keys section in settings */
  enableApiKeysUI: false,

  /** Show documentation link in support */
  enableDocs: false,

  /** Show the component inventory route (dev only) */
  enableComponentInventory: process.env.NODE_ENV === "development",

  /** Show fixtures generator panel */
  enableFixturesGenerator: process.env.NODE_ENV === "development",
} as const

export type FeatureFlag = keyof typeof flags
