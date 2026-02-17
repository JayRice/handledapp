"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight } from "lucide-react"

const testimonials = [
  {
    name: "Marcus Johnson",
    business: "Johnson HVAC",
    city: "Austin, TX",
    quote:
      "We recovered 3 jobs in the first week alone. One was a $4,200 ductwork replacement that would have gone to a competitor.",
    stars: 5,
  },
  {
    name: "Sarah Chen",
    business: "ClearFlow Plumbing",
    city: "Denver, CO",
    quote:
      "I used to lose after-hours calls every single weekend. Now every missed call gets a reply and most of them book. It's like having a second dispatcher.",
    stars: 5,
  },
  {
    name: "David Ramirez",
    business: "Ramirez Electric",
    city: "Phoenix, AZ",
    quote:
      "Setup took me literally 4 minutes. Forwarded my calls, customized the message, done. I booked a panel upgrade from a missed call that same afternoon.",
    stars: 5,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function TestimonialsSection() {
  return (
    <section className="relative py-20 lg:py-28 bg-card/30 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-emerald-muted">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Real results from real service pros.
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {`"${t.quote}"`}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-muted text-primary font-bold text-sm">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.business} — {t.city}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Before / After */}
        <motion.div
          className="mt-12 mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/50 bg-muted/30 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Before</p>
              <p className="text-sm text-foreground">Missed calls go cold. Voicemails pile up. Leads vanish.</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-emerald-muted/30 p-5">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">After</p>
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <p className="text-sm text-foreground">Every missed call gets a reply. Leads convert. Revenue grows.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
