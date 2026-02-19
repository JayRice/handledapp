"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, ArrowRight, Loader2, Check } from "lucide-react"
import { ThemeToggle } from "@/components/handled/theme-toggle"

const benefits = [
  "14-day free trial, no credit card required",
  "Automatic missed-call text-back",
  "AI-powered lead capture",
  "Works with your existing number",
]

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return;
    }
    setIsLoading(true)
    try {
      await signUp(email, password)
      // Put rate limits right here

      router.push("/onboarding")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-emerald-glow blur-[120px] opacity-30" />
      </div>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-lg">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Phone className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Handled</span>
        </Link>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Start your free trial</CardTitle>
            <CardDescription>Get Handled running for your business in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="mb-6 flex flex-col gap-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Full Name</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              <Button type="submit" className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By signing up you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
