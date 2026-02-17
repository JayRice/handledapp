"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  onboardingComplete: boolean
  orgName?: string
  trade?: string
  timezone?: string
  plan?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => void
  completeOnboarding: (data: Partial<User>) => void
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("handled_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem("handled_user")
      }
    }
    setLoading(false)
  }, [])

  const persistUser = useCallback((u: User) => {
    setUser(u)
    localStorage.setItem("handled_user", JSON.stringify(u))
  }, [])

  const signIn = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800))
    const existing = localStorage.getItem("handled_user_db_" + email)
    if (existing) {
      const u = JSON.parse(existing) as User
      persistUser(u)
    } else {
      const u: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split("@")[0],
        onboardingComplete: false,
        plan: "trial",
      }
      localStorage.setItem("handled_user_db_" + email, JSON.stringify(u))
      persistUser(u)
    }
  }, [persistUser])

  const signUp = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800))
    const u: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split("@")[0],
      onboardingComplete: false,
      plan: "trial",
    }
    localStorage.setItem("handled_user_db_" + email, JSON.stringify(u))
    persistUser(u)
  }, [persistUser])

  const signOut = useCallback(() => {
    setUser(null)
    localStorage.removeItem("handled_user")
    router.push("/sign-in")
  }, [router])

  const completeOnboarding = useCallback((data: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...data, onboardingComplete: true }
    persistUser(updated)
    if (user.email) {
      localStorage.setItem("handled_user_db_" + user.email, JSON.stringify(updated))
    }
  }, [user, persistUser])

  const updateUser = useCallback((data: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...data }
    persistUser(updated)
    if (user.email) {
      localStorage.setItem("handled_user_db_" + user.email, JSON.stringify(updated))
    }
  }, [user, persistUser])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, completeOnboarding, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
