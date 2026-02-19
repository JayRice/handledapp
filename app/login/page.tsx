"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, ArrowRight, Loader2 } from "lucide-react"
import { ThemeToggle } from "@/components/handled/theme-toggle"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{message: string, action?: (() => void) | null}>({message: "", action: null})
  const { signIn, resendVerification } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError({message:""})
    if (!email || !password) {
      setError({message: "Please fill in all fields."})
      return
    }
    setIsLoading(true)
    try {
      const result = await signIn(email, password);

      console.log("error: ", result)
      if (result.error?.message == "Email not confirmed"){
        return setError({message: "Email not confirmed, go check your inbox to continue", action: () => {
            resendVerification(email);
        }})
      }
      if (result.error){return setError({message: result.error.message.split(" ").slice(0,25).join(" ")})}
      // Put rate limits right here
      router.push("/app")
    } catch {
      setError({message: "Invalid credentials. Please try again."})
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-emerald-glow blur-[120px] opacity-30" />
      </div>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Phone className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Handled</span>
        </Link>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your Handled account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error.message && (
                  (!error.action ? <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error.message}
                </div>:
                <a onClick={error.action} className="cursor-pointer rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error.message}
                </a>)
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button type="submit" className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/sign-up" className="font-medium text-primary hover:underline">
                Start free trial
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
