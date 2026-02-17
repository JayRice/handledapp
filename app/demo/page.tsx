"use client"

import { useState } from "react"
import { DashboardSkeleton, InboxSkeleton, TableSkeleton, SettingsSkeleton } from "@/components/handled/common/skeletons"
import { Banner } from "@/components/handled/common/banner"
import { StatCard } from "@/components/handled/common/stat-card"
import { SectionCard } from "@/components/handled/common/section-card"
import { PageHeader } from "@/components/handled/common/page-header"
import { ComingSoonButton } from "@/components/handled/common/coming-soon"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, MessageSquare, Calendar, Zap, AlertTriangle, ArrowLeft, Info } from "lucide-react"
import Link from "next/link"
import type { AppBanner } from "@/types/handled"

const demoBanners: AppBanner[] = [
  { id: "1", variant: "info", message: "This is an info banner with an action.", dismissible: true, action: { label: "Learn more", href: "#" } },
  { id: "2", variant: "warn", message: "Your trial ends in 3 days. Upgrade to keep your automations running.", dismissible: true, action: { label: "Upgrade now", href: "#" } },
  { id: "3", variant: "error", message: "SMS delivery is degraded. We are investigating.", dismissible: false },
  { id: "4", variant: "success", message: "Your account has been verified successfully.", dismissible: true },
]

export default function DemoPage() {
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
            <Link href="/"><ArrowLeft className="h-4 w-4" /> Back to site</Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-foreground">Component Demo</h1>
            <p className="text-xs text-muted-foreground">Design system preview</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/app">Open app</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-12">
        {/* Banners */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Banners</h2>
          <div className="space-y-2">
            {demoBanners.filter(b => !dismissedBanners.includes(b.id)).map((banner) => (
              <Banner
                key={banner.id}
                banner={banner}
                onDismiss={() => setDismissedBanners(prev => [...prev, banner.id])}
              />
            ))}
            {dismissedBanners.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setDismissedBanners([])}>
                Reset banners
              </Button>
            )}
          </div>
        </section>

        {/* Stat Cards */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Stat Cards</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Phone} title="Total calls" value="47" trend={{ value: "+12%", positive: true }} />
            <StatCard icon={MessageSquare} title="SMS sent" value="142" trend={{ value: "+8%", positive: true }} />
            <StatCard icon={Calendar} title="Jobs booked" value="23" trend={{ value: "+18%", positive: true }} />
            <StatCard icon={Zap} title="Response rate" value="94%" trend={{ value: "-2%", positive: false }} />
          </div>
        </section>

        {/* Section Card */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Section Card</h2>
          <SectionCard title="Example Section" description="A reusable card with title and optional description.">
            <p className="text-sm text-muted-foreground">Content goes here. This is a SectionCard with a slot for children.</p>
          </SectionCard>
        </section>

        {/* Page Header */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Page Header</h2>
          <PageHeader title="Page Title" description="A brief description for this page." />
        </section>

        {/* Coming Soon */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Coming Soon Button</h2>
          <div className="flex items-center gap-3">
            <ComingSoonButton>Integrations</ComingSoonButton>
            <ComingSoonButton>API Keys</ComingSoonButton>
            <ComingSoonButton>Webhooks</ComingSoonButton>
          </div>
        </section>

        {/* Skeleton Loaders */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Skeleton Loaders</h2>
          <Tabs defaultValue="dashboard">
            <TabsList className="bg-muted">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-4 rounded-lg border border-border p-4 bg-card">
              <DashboardSkeleton />
            </TabsContent>
            <TabsContent value="inbox" className="mt-4 rounded-lg border border-border overflow-hidden bg-card h-[500px]">
              <InboxSkeleton />
            </TabsContent>
            <TabsContent value="table" className="mt-4 rounded-lg border border-border p-4 bg-card">
              <TableSkeleton rows={4} />
            </TabsContent>
            <TabsContent value="settings" className="mt-4 rounded-lg border border-border p-4 bg-card">
              <SettingsSkeleton />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  )
}
