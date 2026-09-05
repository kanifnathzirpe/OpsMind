"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechFlow Inc",
      company: "TechFlow Inc",
      image: "SC",
      rating: 5,
      content: "OpsMind transformed our payment recovery. We recovered $2.4M in failed payments in just 3 months. The AI agents are incredibly accurate.",
      metrics: "$2.4M recovered",
    },
    {
      name: "Michael Rodriguez",
      role: "CFO, Global Retail",
      company: "Global Retail",
      image: "MR",
      rating: 5,
      content: "The cash flow forecasting is remarkable. It's like having a financial analyst working 24/7. Our decision-making has never been better.",
      metrics: "45% better forecasting",
    },
    {
      name: "Emily Watson",
      role: "Head of Operations, ScaleUp",
      company: "ScaleUp",
      image: "EW",
      rating: 5,
      content: "Fraud detection used to be a nightmare. Now OpsMind blocks suspicious transactions before they happen. Zero false positives so far.",
      metrics: "99.9% fraud detection",
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See what our customers have to say about OpsMind
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="gradient-border rounded-2xl p-1"
            >
              <div className="glass rounded-2xl p-8 h-full">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-electric-blue/20" />
                  <p className="text-gray-300 text-sm relative z-10 pl-6">
                    {testimonial.content}
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-emerald-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-emerald-400 text-sm font-medium">
                    {testimonial.metrics}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}