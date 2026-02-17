import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { SocialProof } from "@/components/landing/social-proof"
import { ProblemSection } from "@/components/landing/problem-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturesSection } from "@/components/landing/features-section"
import { IndustriesSection } from "@/components/landing/industries-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { FaqSection } from "@/components/landing/faq-section"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <SocialProof />
      <ProblemSection />
      <HowItWorks />
      <FeaturesSection />
      <IndustriesSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </main>
  )
}
