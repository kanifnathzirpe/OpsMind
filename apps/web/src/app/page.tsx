"use client";

import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustedMetrics } from "@/components/landing/trusted-metrics";
import { MerchantProblems } from "@/components/landing/merchant-problems";
import { AIAgents } from "@/components/landing/ai-agents";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] smooth-scroll">
      <Navbar />
      <Hero />
      <TrustedMetrics />
      <MerchantProblems />
      <AIAgents />
      <DashboardPreview />
      <FeaturesGrid />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
