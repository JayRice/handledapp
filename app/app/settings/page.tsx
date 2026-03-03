"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/AuthProvider"
import { useDevMode } from "@/components/providers/dev-mode-provider"
import { useAppStore } from "@/lib/store/app-store"
import { ComingSoonButton } from "@/components/handled/common/coming-soon"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  User,
  Building2,
  Bell,
  CreditCard,
  Puzzle,
  Users,
  Trash2,
  Save,
  Camera,
  Shield,
  Check,
  AlertTriangle,
  Copy,
  Download,
  Plus,
  Star,
  Pause,
  X,
  ExternalLink,
} from "lucide-react"

// ── Profile Tab ──────────────────────────────────────────────
function ProfileTab() {
  const { profile, updateProfile } = useAuth()
  const [name, setName] = useState(profile?.name || "")
  const [email] = useState(profile?.email || "")
  const [phone, setPhone] = useState("")
  const [saving, setSaving] = useState(false)

  function handleSave() {
    setSaving(true)
    setTimeout(async () => {
      await updateProfile({ name })
      setSaving(false)
      toast.success("Profile updated")
    }, 600)
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Your Profile</CardTitle>
          <CardDescription>Manage your personal information and account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Photo upload coming soon")}>
                <Camera className="h-3.5 w-3.5" /> Change photo
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled className="opacity-70" />
              <p className="text-xs text-muted-foreground">Contact support to change email.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue={profile?.timezone || "america-new_york"}>
                <SelectTrigger id="timezone" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="america-new_york">Eastern (ET)</SelectItem>
                  <SelectItem value="america-chicago">Central (CT)</SelectItem>
                  <SelectItem value="america-denver">Mountain (MT)</SelectItem>
                  <SelectItem value="america-los_angeles">Pacific (PT)</SelectItem>
                  <SelectItem value="america-anchorage">Alaska (AKT)</SelectItem>
                  <SelectItem value="pacific-honolulu">Hawaii (HT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Password & Security</CardTitle>
          <CardDescription>Update your password and security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentPw">Current Password</Label>
              <Input id="currentPw" type="password" placeholder="Enter current password" />
            </div>
            <div />
            <div className="space-y-2">
              <Label htmlFor="newPw">New Password</Label>
              <Input id="newPw" type="password" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPw">Confirm New Password</Label>
              <Input id="confirmPw" type="password" placeholder="Confirm new password" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
              </div>
            </div>
            <Switch />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => toast.success("Password updated (demo)")}>Update Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Business Tab ──────────────────────────────────────────────
function BusinessTab() {
  const { user, updateProfile, organization } = useAuth()
  const [orgName, setOrgName] = useState(organization?.name || "")
  const [trade, setTrade] = useState(organization?.trade || "hvac")
  const [address, setAddress] = useState(organization?.address || "")
  const [website, setWebsite] = useState("")
  const [saving, setSaving] = useState(false)

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("Business info updated (demo)")
    }, 600)
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Business Information</CardTitle>
          <CardDescription>Details about your service business.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="orgName">Business Name</Label>
              <Input id="orgName" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trade">Trade / Industry</Label>
              <Select value={trade} onValueChange={setTrade}>
                <SelectTrigger id="trade" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="roofing">Roofing</SelectItem>
                  <SelectItem value="landscaping">Landscaping</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="general">General Contractor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Business Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, City, State ZIP" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://mybusiness.com" />
            </div>
            <div className="space-y-2">
              <Label>Business Phone</Label>
              <div className="flex items-center gap-2">
                <Input value="+1 (555) 867-5309" disabled className="opacity-70" />
                <Badge variant="outline" className="shrink-0 border-primary/30 text-primary bg-emerald-muted">Verified</Badge>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Business Hours</CardTitle>
          <CardDescription>Set when you are available to receive calls.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              <div key={day} className="flex items-center gap-4">
                <span className="w-24 text-sm text-foreground">{day}</span>
                <Input defaultValue="8:00 AM" className="w-28 text-center" />
                <span className="text-sm text-muted-foreground">to</span>
                <Input defaultValue="6:00 PM" className="w-28 text-center" />
                <Switch defaultChecked />
              </div>
            ))}
            {["Saturday", "Sunday"].map((day) => (
              <div key={day} className="flex items-center gap-4">
                <span className="w-24 text-sm text-foreground">{day}</span>
                <Input defaultValue="9:00 AM" className="w-28 text-center" />
                <span className="text-sm text-muted-foreground">to</span>
                <Input defaultValue="2:00 PM" className="w-28 text-center" />
                <Switch defaultChecked={day === "Saturday"} />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => toast.success("Business hours saved (demo)")} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Hours</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Notifications Tab ──────────────────────────────────────────────
function NotificationsTab() {
  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Notification Preferences</CardTitle>
          <CardDescription>Choose how and when you want to be notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {[
            { title: "Missed call alerts", desc: "Get notified when a call is missed and auto-text fires.", defaultOn: true },
            { title: "New conversation", desc: "When a customer replies to an automated text.", defaultOn: true },
            { title: "Booking confirmation", desc: "When a caller books through your scheduling link.", defaultOn: true },
            { title: "Daily summary", desc: "Receive a daily email digest of all activity.", defaultOn: false },
            { title: "Weekly analytics report", desc: "Weekly email with performance metrics.", defaultOn: false },
            { title: "Opt-out alerts", desc: "When a contact opts out of SMS.", defaultOn: true },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.defaultOn} onCheckedChange={() => toast.success(`${item.title} updated (demo)`)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Delivery Channels</CardTitle>
          <CardDescription>Where should notifications be sent?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { channel: "Email notifications", defaultOn: true },
            { channel: "SMS notifications", defaultOn: true },
            { channel: "Push notifications (browser)", defaultOn: false },
          ].map((ch) => (
            <div key={ch.channel} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{ch.channel}</span>
              <Switch defaultChecked={ch.defaultOn} />
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button onClick={() => toast.success("Notification preferences saved (demo)")} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Billing Tab (with mock store) ──────────────────────────────────
function BillingTab() {
  const { user, organization } = useAuth()
  const { devMode } = useDevMode()
  const billing = useAppStore((s) => s.billing)
  const setBillingStatus = useAppStore((s) => s.setBillingStatus)
  const addPaymentMethodStore = useAppStore((s) => s.addPaymentMethod)
  const removePaymentMethod = useAppStore((s) => s.removePaymentMethod)
  const setDefaultPaymentMethod = useAppStore((s) => s.setDefaultPaymentMethod)
  const billingStatus = billing.status
  const paymentMethods = billing.paymentMethods
  const isPro = organization?.plan === "pro"

  const [addPmOpen, setAddPmOpen] = useState(false)
  const [pauseOpen, setPauseOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [pmName, setPmName] = useState("")
  const [pmNumber, setPmNumber] = useState("")
  const [pmExpiry, setPmExpiry] = useState("")
  const [pmCvc, setPmCvc] = useState("")
  const [pmZip, setPmZip] = useState("")

  function handleAddPm() {
    if (!pmName || !pmNumber || !pmExpiry) {
      toast.error("Please fill in all required fields")
      return
    }
    addPaymentMethodStore({
      id: `pm_${Date.now()}`,
      type: pmNumber.startsWith("4") ? "Visa" : pmNumber.startsWith("5") ? "Mastercard" : "Card",
      last4: pmNumber.slice(-4),
      expiry: pmExpiry,
      isDefault: paymentMethods.length === 0,
      name: pmName,
    })
    setAddPmOpen(false)
    setPmName(""); setPmNumber(""); setPmExpiry(""); setPmCvc(""); setPmZip("")
    toast.success("Payment method added (demo)")
  }

  return (
    <div className="space-y-6">
      {/* Billing status banner */}
      {billingStatus !== "active" && (
        <Card className={`border-border ${billingStatus === "paused" ? "border-amber-500/30 bg-amber-500/5" : "border-destructive/30 bg-destructive/5"}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {billingStatus === "paused" ? <Pause className="h-5 w-5 text-amber-500" /> : <X className="h-5 w-5 text-destructive" />}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {billingStatus === "paused" ? "Account Paused" : "Subscription Canceled"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {billingStatus === "paused" ? "Automations are disabled. Reactivate to resume." : "Your plan has been canceled. Reactivate to continue using Handled."}
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={() => { setBillingStatus("active"); toast.success("Account reactivated (demo)") }} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Reactivate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Plan */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Current Plan</CardTitle>
              <CardDescription>Manage your subscription and billing.</CardDescription>
            </div>
            <Badge className={isPro ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
              {isPro ? "Pro" : "Free Trial"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-primary/20 bg-emerald-muted p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-foreground">{isPro ? "$49" : "$0"}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                <p className="text-sm text-muted-foreground">{isPro ? "Unlimited SMS, all features" : "14-day free trial \u2014 300 SMS included"}</p>
              </div>
              {!isPro && (
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => toast.success("Upgraded to Pro (demo)")}>
                  Upgrade to Pro
                </Button>
              )}
            </div>
            {!isPro && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Trial: 8 days remaining</span>
                  <span>142 / 300 SMS used</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted">
                  <div className="h-full w-[47%] rounded-full bg-primary" />
                </div>
              </div>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              "Unlimited missed-call texts",
              "AI-powered smart replies",
              "Booking link integration",
              "Custom SMS templates",
              "Analytics & reporting",
              "Priority support",
              "Team members (up to 5)",
              "API access",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Payment Methods</CardTitle>
              <CardDescription>Manage your payment information.</CardDescription>
            </div>
            <Dialog open={addPmOpen} onOpenChange={setAddPmOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2"><Plus className="h-3.5 w-3.5" /> Add method</Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Add Payment Method</DialogTitle>
                  <DialogDescription>Add a new credit or debit card</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Cardholder Name</Label>
                    <Input value={pmName} onChange={(e) => setPmName(e.target.value)} placeholder="John Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input value={pmNumber} onChange={(e) => setPmNumber(e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Expiry</Label>
                      <Input value={pmExpiry} onChange={(e) => setPmExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div className="space-y-2">
                      <Label>CVC</Label>
                      <Input value={pmCvc} onChange={(e) => setPmCvc(e.target.value)} placeholder="123" maxLength={4} type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>ZIP</Label>
                      <Input value={pmZip} onChange={(e) => setPmZip(e.target.value)} placeholder="12345" maxLength={5} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddPmOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddPm} className="bg-primary text-primary-foreground hover:bg-primary/90">Add Card</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentMethods.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No payment methods on file.</p>
          ) : (
            paymentMethods.map((pm) => (
              <div key={pm.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-14 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
                    {pm.type.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {pm.type} ending in {pm.last4}
                      {pm.isDefault && <Badge className="ml-2 bg-primary/10 text-primary border-primary/20 text-[10px]">Default</Badge>}
                    </p>
                    <p className="text-xs text-muted-foreground">Expires {pm.expiry} - {pm.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!pm.isDefault && (
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setDefaultPaymentMethod(pm.id); toast.success("Default updated (demo)") }}>
                      <Star className="h-3 w-3 mr-1" /> Set default
                    </Button>
                  )}
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={() => { removePaymentMethod(pm.id); toast.success("Payment method removed (demo)") }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
          <div className="flex items-center justify-between text-sm pt-2">
            <span className="text-muted-foreground">Next billing date</span>
            <span className="text-foreground">March 15, 2026</span>
          </div>
        </CardContent>
      </Card>

      {/* Manage Billing / Pause / Cancel */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Subscription Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {devMode ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-3.5 w-3.5" /> Manage Billing
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Stripe Portal (Demo)</SheetTitle>
                  <SheetDescription>
                    In production, this button will redirect to the Stripe Customer Portal where customers can manage subscriptions, update payment methods, and download invoices.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="rounded-lg border border-border p-4 bg-muted/30">
                    <p className="text-sm font-medium text-foreground">What happens here:</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                      <li>- View and update subscription plan</li>
                      <li>- Manage payment methods</li>
                      <li>- Download invoices and receipts</li>
                      <li>- Update billing address</li>
                      <li>- Cancel or pause subscription</li>
                    </ul>
                  </div>
                  <p className="text-xs text-muted-foreground">This is a demo preview. Connect Stripe to enable the real portal.</p>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <ComingSoonButton><ExternalLink className="h-3.5 w-3.5 mr-2" /> Manage Billing</ComingSoonButton>
          )}

          {billingStatus === "active" && (
            <>
              <Dialog open={pauseOpen} onOpenChange={setPauseOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                    <Pause className="h-3.5 w-3.5" /> Pause Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Pause Subscription?</DialogTitle>
                    <DialogDescription>
                      All automations will be disabled and billing will be paused. You can reactivate at any time.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPauseOpen(false)}>Cancel</Button>
                    <Button className="bg-amber-500 text-amber-950 hover:bg-amber-500/90" onClick={() => { setBillingStatus("paused"); setPauseOpen(false); toast.info("Account paused (demo)") }}>
                      Pause Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10">
                    <X className="h-3.5 w-3.5" /> Cancel Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-destructive">Cancel Subscription?</DialogTitle>
                    <DialogDescription>
                      Your plan will be canceled at the end of the current billing period. You will lose access to all premium features.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCancelOpen(false)}>Keep Subscription</Button>
                    <Button variant="destructive" onClick={() => { setBillingStatus("canceled"); setCancelOpen(false); toast.error("Subscription canceled (demo)") }}>
                      Cancel Subscription
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Invoices</CardTitle>
          <CardDescription>Download past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { date: "Feb 15, 2026", amount: "$49.00", status: "Paid" },
              { date: "Jan 15, 2026", amount: "$49.00", status: "Paid" },
              { date: "Dec 15, 2025", amount: "$49.00", status: "Paid" },
            ].map((inv) => (
              <div key={inv.date} className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{inv.date}</p>
                  <p className="text-xs text-muted-foreground">{inv.amount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-primary/30 text-primary bg-emerald-muted">{inv.status}</Badge>
                  <Button variant="ghost" size="icon-sm" onClick={() => toast.success("Invoice downloaded (demo)")}>
                    <Download className="h-3.5 w-3.5" />
                    <span className="sr-only">Download invoice</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Integrations Tab (Coming Soon) ──────────────────────────────────
function IntegrationsTab() {
  const integrations = [
    { name: "Google Calendar", desc: "Sync bookings to your calendar", connected: true, icon: "GCal" },
    { name: "Housecall Pro", desc: "Dispatch and invoicing integration", connected: false, icon: "HCP" },
    { name: "Jobber", desc: "Field service management sync", connected: false, icon: "JBR" },
    { name: "ServiceTitan", desc: "Enterprise field service platform", connected: false, icon: "ST" },
    { name: "QuickBooks", desc: "Accounting and invoicing sync", connected: false, icon: "QB" },
    { name: "Zapier", desc: "Connect to 5,000+ apps", connected: true, icon: "Zap" },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Connected Integrations</CardTitle>
          <CardDescription>Connect your favorite tools to streamline your workflow.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {integrations.map((int) => (
              <div key={int.name} className="flex items-center justify-between rounded-lg border border-border p-4 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                    {int.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{int.name}</p>
                    <p className="text-xs text-muted-foreground">{int.desc}</p>
                  </div>
                </div>
                <ComingSoonButton size="sm">
                  {int.connected ? "Manage" : "Connect"}
                </ComingSoonButton>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card opacity-60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">API Access</CardTitle>
              <CardDescription>Use our API to build custom integrations.</CardDescription>
            </div>
            <Badge variant="outline" className="border-border text-muted-foreground">Coming Soon</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex items-center gap-2">
              <Input value="hndl_sk_live_xxxxxxxxxxxx" disabled className="font-mono text-sm opacity-70" />
              <Button variant="outline" size="icon" disabled>
                <Copy className="h-3.5 w-3.5" />
                <span className="sr-only">Copy API key</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">API access will be available in a future release.</p>
          </div>
          <div className="flex items-center gap-2">
            <ComingSoonButton>
              <ExternalLink className="h-3.5 w-3.5 mr-2" /> View API Docs
            </ComingSoonButton>
            <ComingSoonButton>Regenerate Key</ComingSoonButton>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Team Tab ──────────────────────────────────────────────
function TeamTab() {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [members, setMembers] = useState([
    { name: "You (Owner)", email: "mike@coolairpros.com", role: "Owner", status: "Active" },
    { name: "Sarah Johnson", email: "sarah@coolairpros.com", role: "Admin", status: "Active" },
    { name: "Jake Williams", email: "jake@coolairpros.com", role: "Technician", status: "Active" },
    { name: "Pending Invite", email: "chris@coolairpros.com", role: "Technician", status: "Pending" },
  ])

  function removeMember(email: string) {
    setMembers(prev => prev.filter(m => m.email !== email))
    toast.success("Member removed (demo)")
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Team Members</CardTitle>
              <CardDescription>Manage who has access to your Handled account.</CardDescription>
            </div>
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Invite Member</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>Send an email invitation to join your team.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email address</Label>
                    <Input id="invite-email" placeholder="teammate@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-role">Role</Label>
                    <Select defaultValue="technician">
                      <SelectTrigger id="invite-role" className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="technician">Technician</SelectItem>
                        <SelectItem value="viewer">Viewer (read-only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setInviteOpen(false); toast.success("Invitation sent (demo)") }}>Send Invite</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.email} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {m.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={m.status === "Pending" ? "border-yellow-500/30 text-yellow-500" : "border-primary/30 text-primary bg-emerald-muted"}>
                    {m.role}
                  </Badge>
                  {m.role !== "Owner" && (
                    <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={() => removeMember(m.email)}>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Remove member</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Danger Zone Tab ──────────────────────────────────────────────
function DangerZoneTab() {
  const { signOut } = useAuth()
  const [deleteText, setDeleteText] = useState("")
  const [exportingData, setExportingData] = useState(false)
  const [pauseOpen, setPauseOpen] = useState(false)
  const setBillingStatus = useAppStore((s) => s.setBillingStatus)

  function handleExport() {
    setExportingData(true)
    setTimeout(() => {
      setExportingData(false)
      toast.success("Data export has been emailed to you (demo)")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Export Data</CardTitle>
          <CardDescription>Download all your data in CSV format.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Export all your conversations, call logs, contacts, and analytics data.
            The file will be emailed to your account email address.
          </p>
          <Button variant="outline" onClick={handleExport} disabled={exportingData} className="gap-2">
            <Download className="h-3.5 w-3.5" />
            {exportingData ? "Preparing export..." : "Export All Data"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/30 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Pause Account
          </CardTitle>
          <CardDescription>Temporarily pause all automations and billing.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Your account will be paused and no automated texts will be sent.
            You can reactivate at any time. Billing will be paused during this period.
          </p>
          <Dialog open={pauseOpen} onOpenChange={setPauseOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10">
                Pause My Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pause Account?</DialogTitle>
                <DialogDescription>All automations and billing will be paused until you reactivate.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPauseOpen(false)}>Cancel</Button>
                <Button className="bg-amber-500 text-amber-950 hover:bg-amber-500/90" onClick={() => { setBillingStatus("paused"); setPauseOpen(false); toast.info("Account paused (demo)") }}>
                  Confirm Pause
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="border-destructive/30 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>Permanently delete your account and all associated data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            This action is irreversible. All your data including conversations, call logs,
            contacts, automations, and analytics will be permanently deleted.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All your data will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <p className="text-sm text-muted-foreground">
                  {'To confirm, type "DELETE" below:'}
                </p>
                <Input
                  value={deleteText}
                  onChange={(e) => setDeleteText(e.target.value)}
                  placeholder='Type "DELETE" to confirm'
                  className="border-destructive/30"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  disabled={deleteText !== "DELETE"}
                  onClick={() => { toast.success("Account deleted (demo)"); signOut() }}
                >
                  Permanently Delete Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Settings Layout ──────────────────────────────────────────────
const settingsTabs = [
  { value: "profile", label: "Profile", icon: User },
  { value: "business", label: "Business", icon: Building2 },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "billing", label: "Billing", icon: CreditCard },
  { value: "integrations", label: "Integrations", icon: Puzzle },
  { value: "team", label: "Team", icon: Users },
  { value: "danger", label: "Danger Zone", icon: Trash2, isDanger: true },
]

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = searchParams.get("tab") || "profile"
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) setActiveTab(tab)
  }, [searchParams])

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
    router.replace(`/app/settings?tab=${value}`, { scroll: false })
  }, [router])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account, business, and preferences.</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col gap-6 lg:flex-row">
        <TabsList className="h-auto w-full flex-row justify-start gap-1 overflow-x-auto bg-transparent p-0 lg:w-52 lg:shrink-0 lg:flex-col lg:items-stretch lg:rounded-lg lg:border lg:border-border lg:bg-card lg:p-2">
          {settingsTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`justify-start gap-2 rounded-md px-3 py-2 text-sm data-[state=active]:bg-emerald-muted data-[state=active]:text-primary data-[state=active]:shadow-none ${
                tab.isDanger ? "text-destructive data-[state=active]:text-destructive data-[state=active]:bg-destructive/10" : ""
              }`}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 min-w-0">
          <TabsContent value="profile"><ProfileTab /></TabsContent>
          <TabsContent value="business"><BusinessTab /></TabsContent>
          <TabsContent value="notifications"><NotificationsTab /></TabsContent>
          <TabsContent value="billing"><BillingTab /></TabsContent>
          <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
          <TabsContent value="team"><TeamTab /></TabsContent>
          <TabsContent value="danger"><DangerZoneTab /></TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
