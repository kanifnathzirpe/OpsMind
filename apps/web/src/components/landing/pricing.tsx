"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Pricing() {
  const plans = [
    {
      name: "Startup",
      price: "$299",
      period: "/month",
      description: "Perfect for growing businesses",
      features: [
        "Up to 10K transactions/month",
        "Basic fraud detection",
        "Payment recovery",
        "Cash flow forecasting",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Growth",
      price: "$799",
      period: "/month",
      description: "For scaling businesses",
      features: [
        "Up to 100K transactions/month",
        "Advanced fraud detection",
        "AI-powered recovery",
        "Advanced forecasting",
        "Priority support",
        "Custom integrations",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited transactions",
        "Enterprise fraud detection",
        "Dedicated AI agents",
        "Custom ML models",
        "24/7 phone support",
        "SLA guarantee",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the plan that fits your business needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`relative ${
                plan.popular ? "gradient-border" : ""
              } rounded-2xl p-1`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-electric-blue to-emerald-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className={`glass rounded-2xl p-8 h-full ${
                plan.popular ? "glow-blue" : ""
              }`}>
                <h3 className="text-white font-semibold text-xl mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-gray-300 text-sm">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/dashboard">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-electric-blue/10 text-white hover:bg-electric-blue/20 border border-electric-blue/30"
                    }`}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}