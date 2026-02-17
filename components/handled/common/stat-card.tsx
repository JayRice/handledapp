import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  iconClassName?: string
  trend?: { value: string; positive: boolean }
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, iconClassName, trend, className }: StatCardProps) {
  return (
    <Card className={cn("border-border bg-card", className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={cn("mt-1 text-xs", trend.positive ? "text-primary" : "text-destructive")}>
                {trend.value}
              </p>
            )}
            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          </div>
          {Icon && (
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-muted", iconClassName)}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
