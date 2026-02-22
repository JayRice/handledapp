"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/AuthProvider"
import { DevModeProvider } from "@/components/providers/dev-mode-provider"
import { AppSidebar } from "@/components/handled/sidebar"
import { Topbar } from "@/components/handled/topbar"
import { BannerStack } from "@/components/handled/common/banner"
import { useAppStore } from "@/lib/store/app-store"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Loader2 } from "lucide-react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, userLoading } = useAuth()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const banners = useAppStore((s) => s.banners)
  const dismissBanner = useAppStore((s) => s.dismissBanner)

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/sign-in")
    }
    if (!userLoading && user && !profile?.org_id) {
      router.push("/onboarding")
    }
  }, [userLoading, user, router])

  if (userLoading || !user || !profile?.org_id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <DevModeProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        </div>

        {/* Mobile sidebar sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-60 p-0">
            <AppSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <BannerStack banners={banners} onDismiss={dismissBanner} />
          <Topbar onMobileMenuToggle={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto px-4 py-4 lg:px-6 lg:py-6">
            {children}
          </main>
        </div>
      </div>
    </DevModeProvider>
  )
}
