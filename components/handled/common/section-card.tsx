import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SectionCardProps {
  title?: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
  noPadding?: boolean
}

export function SectionCard({ title, description, children, actions, className, noPadding }: SectionCardProps) {
  return (
    <Card className={cn("border-border bg-card", className)}>
      {(title || actions) && (
        <CardHeader className={cn(noPadding && "pb-0")}>
          <div className="flex items-center justify-between">
            <div>
              {title && <CardTitle className="text-foreground">{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(noPadding && "p-0", !title && !actions && "pt-6")}>
        {children}
      </CardContent>
    </Card>
  )
}
