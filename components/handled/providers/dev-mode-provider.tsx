"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface DevModeContextType {
  devMode: boolean
  setDevMode: (v: boolean) => void
  isDev: boolean
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined)

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [devMode, setDevModeState] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isDev = process.env.NODE_ENV === "development"

  useEffect(() => {
    setMounted(true)
    if (isDev) {
      const stored = localStorage.getItem("handled_dev_mode")
      if (stored === "true") setDevModeState(true)
    }
  }, [isDev])

  const setDevMode = useCallback((v: boolean) => {
    setDevModeState(v)
    localStorage.setItem("handled_dev_mode", String(v))
  }, [])

  if (!mounted) {
    return (
      <DevModeContext.Provider value={{ devMode: false, setDevMode, isDev }}>
        {children}
      </DevModeContext.Provider>
    )
  }

  return (
    <DevModeContext.Provider value={{ devMode: isDev ? devMode : false, setDevMode, isDev }}>
      {children}
    </DevModeContext.Provider>
  )
}

export function useDevMode() {
  const ctx = useContext(DevModeContext)
  if (!ctx) throw new Error("useDevMode must be used within DevModeProvider")
  return ctx
}
