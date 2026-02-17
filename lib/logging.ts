// ── Error logging hook ───────────────────────────────
// In Dev Mode: logs to console + stores in an in-app log list.
// In Production: could be replaced with Sentry, LogRocket, etc.

export interface LogEntry {
  timestamp: string
  level: "error" | "warn" | "info"
  message: string
  context?: string
  stack?: string
}

const MAX_LOG_ENTRIES = 100
let logStore: LogEntry[] = []

export function logError(error: unknown, context?: string): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "error",
    message: error instanceof Error ? error.message : String(error),
    context,
    stack: error instanceof Error ? error.stack : undefined,
  }

  // Always log to console
  console.error(`[Handled] ${context ? `[${context}]` : ""} ${entry.message}`, error)

  // Store in memory (dev mode inspection)
  logStore = [entry, ...logStore].slice(0, MAX_LOG_ENTRIES)
}

export function logWarn(message: string, context?: string): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "warn",
    message,
    context,
  }

  console.warn(`[Handled] ${context ? `[${context}]` : ""} ${message}`)
  logStore = [entry, ...logStore].slice(0, MAX_LOG_ENTRIES)
}

export function logInfo(message: string, context?: string): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "info",
    message,
    context,
  }

  if (process.env.NODE_ENV === "development") {
    console.info(`[Handled] ${context ? `[${context}]` : ""} ${message}`)
  }
  logStore = [entry, ...logStore].slice(0, MAX_LOG_ENTRIES)
}

export function getLogEntries(): LogEntry[] {
  return [...logStore]
}

export function clearLogs(): void {
  logStore = []
}
