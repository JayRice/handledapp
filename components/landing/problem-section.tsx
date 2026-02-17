"use client"

import { motion } from "framer-motion"
import { Wrench, Moon, Timer } from "lucide-react"

const cards = [
  {
    icon: Wrench,
    title: "You're on a job",
    description:
      "Hands full, crawlspace deep — you can't answer. That caller moves on to the next contractor in 60 seconds.",
  },
  {
    icon: Moon,
    title: "After-hours calls",
    description:
      "Evenings and weekends are when homeowners search. If nobody picks up, they keep scrolling.",
  },
  {
    icon: Timer,
    title: "No one calls back fast enough",
    description:
      "By the time you see the voicemail, that lead already booked someone else. Speed wins.",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function ProblemSection() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Every missed call is money on the table.
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                variants={cardVariants}
                className="group relative rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/80"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-muted transition-colors group-hover:bg-primary/20">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
