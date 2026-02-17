import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-foreground text-balance">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        {"The page you're looking for doesn't exist or has been moved."}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button variant="outline" asChild className="gap-2">
          <Link href="/"><ArrowLeft className="h-4 w-4" /> Back to home</Link>
        </Button>
        <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/app"><Home className="h-4 w-4" /> Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
