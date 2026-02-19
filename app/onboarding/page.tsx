"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Phone, ArrowRight, ArrowLeft, Building2, Settings2, Zap, Check, HelpCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

const steps = [
  { id: 1, title: "Business basics", icon: Building2 },
  { id: 2, title: "Phone setup", icon: Phone },
  { id: 3, title: "Automations", icon: Zap },
  { id: 4, title: "Review", icon: Check },
]

const trades = ["HVAC", "Plumbing", "Electrical", "General Contractor", "Roofing", "Landscaping", "Pest Control", "Cleaning", "Other"]
const timezones = ["US/Eastern", "US/Central", "US/Mountain", "US/Pacific", "US/Alaska", "US/Hawaii"]
const tonePresets = [
  { value: "professional", label: "Professional", desc: "Formal and polished" },
  { value: "friendly", label: "Friendly", desc: "Warm and approachable" },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, userLoading, profile } = useAuth()
  const router = useRouter()

  const [data, setData] = useState({
    businessName: "",
    trade: "",
    timezone: "",
    areaCode: "",
    forwardTo: "",
    ackForwarding: false,
    missedCallTextBack: true,
    followUps: true,
    tonePreset: "friendly",
  })

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/sign-in")
    }
    if (!userLoading && profile?.orgId) {
      router.push("/app")
    }
  }, [userLoading, user, router])

  if (userLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleFinish = async () => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    completeOnboarding({
      orgName: data.businessName,
      trade: data.trade,
      timezone: data.timezone,
    })
    toast.success("Setup complete! Welcome to Handled.")
    router.push("/app")
  }

  const canProceed = () => {
    if (step === 1) return data.businessName && data.trade && data.timezone
    if (step === 2) return data.forwardTo && data.ackForwarding
    return true
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-emerald-glow blur-[120px] opacity-20" />
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Phone className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Handled</span>
        </div>
        <Badge variant="outline" className="border-primary/30 text-primary bg-emerald-muted">
          Step {step} of {steps.length}
        </Badge>
      </div>

      {/* Progress */}
      <div className="relative mx-auto w-full max-w-2xl px-4">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    step > s.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : step === s.id
                        ? "border-primary bg-emerald-muted text-primary"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {step > s.id ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className={`text-xs hidden sm:block ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 rounded transition-all ${step > s.id ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="relative mx-auto mt-8 w-full max-w-2xl flex-1 px-4 pb-24">
        {step === 1 && (
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Tell us about your business</CardTitle>
              <CardDescription>This helps us customize your Handled experience.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="businessName">Business name</Label>
                <Input id="businessName" placeholder="e.g. Smith HVAC" value={data.businessName} onChange={(e) => setData({ ...data, businessName: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Trade</Label>
                <Select value={data.trade} onValueChange={(v) => setData({ ...data, trade: v })}>
                  <SelectTrigger><SelectValue placeholder="Select your trade" /></SelectTrigger>
                  <SelectContent>
                    {trades.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Timezone</Label>
                <Select value={data.timezone} onValueChange={(v) => setData({ ...data, timezone: v })}>
                  <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
                  <SelectContent>
                    {timezones.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Set up your phone</CardTitle>
              <CardDescription>{"We'll provision a Handled number and route missed calls through it."}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="areaCode">Preferred area code</Label>
                <Input id="areaCode" placeholder="e.g. 512" maxLength={3} value={data.areaCode} onChange={(e) => setData({ ...data, areaCode: e.target.value.replace(/\D/g, "") })} />
                <p className="text-xs text-muted-foreground">{"We'll try to match this, but availability varies."}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="forwardTo">Forward calls to (your cell / office)</Label>
                <Input id="forwardTo" type="tel" placeholder="(555) 123-4567" value={data.forwardTo} onChange={(e) => setData({ ...data, forwardTo: e.target.value })} />
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
                <Checkbox id="ackForwarding" checked={data.ackForwarding} onCheckedChange={(c) => setData({ ...data, ackForwarding: !!c })} className="mt-0.5" />
                <div>
                  <Label htmlFor="ackForwarding" className="text-sm font-medium">I understand how call forwarding works</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {"You'll need to set up call forwarding on your carrier to route missed calls to your Handled number. We'll provide step-by-step instructions after setup."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Automation preferences</CardTitle>
              <CardDescription>Choose how Handled responds to missed calls. You can adjust these later.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Missed-call auto text-back</p>
                  <p className="text-sm text-muted-foreground">Instantly text callers when you miss their call</p>
                </div>
                <Switch checked={data.missedCallTextBack} onCheckedChange={(c) => setData({ ...data, missedCallTextBack: c })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Follow-up sequences</p>
                  <p className="text-sm text-muted-foreground">Send follow-ups if the lead does not reply</p>
                </div>
                <Switch checked={data.followUps} onCheckedChange={(c) => setData({ ...data, followUps: c })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Tone preset</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {tonePresets.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setData({ ...data, tonePreset: t.value })}
                      className={`rounded-lg border p-4 text-left transition-all ${
                        data.tonePreset === t.value
                          ? "border-primary bg-emerald-muted ring-1 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium text-foreground">{t.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Review your setup</CardTitle>
              <CardDescription>Everything look good? You can change these settings later.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Business</p>
                  <p className="mt-1 font-medium text-foreground">{data.businessName || "Not set"}</p>
                  <p className="text-sm text-muted-foreground">{data.trade} &middot; {data.timezone}</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</p>
                  <p className="mt-1 font-medium text-foreground">Forward to: {data.forwardTo || "Not set"}</p>
                  <p className="text-sm text-muted-foreground">Area code: {data.areaCode || "Any"}</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Auto text-back</p>
                  <p className="mt-1 font-medium text-foreground">{data.missedCallTextBack ? "Enabled" : "Disabled"}</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Follow-ups</p>
                  <p className="mt-1 font-medium text-foreground">{data.followUps ? "Enabled" : "Disabled"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Need help panel */}
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            Need help? <button type="button" className="text-primary hover:underline" onClick={() => toast.info("Support chat coming soon!")}>Chat with us</button> or email{" "}
            <span className="text-primary">support@handled.app</span>
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings2 className="mr-2 h-4 w-4" />}
              {isSubmitting ? "Setting up..." : "Finish setup"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
