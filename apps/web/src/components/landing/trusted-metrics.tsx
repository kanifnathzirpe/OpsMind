"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { TrendingUp, Users, Target, Bot } from "lucide-react";

export function TrustedMetrics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [counts, setCounts] = useState({ revenue: 0, merchants: 0, accuracy: 0, agents: 0 });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      const timer = setInterval(() => {
        setCounts((prev) => ({
          revenue: Math.min(prev.revenue + 45 / steps, 45),
          merchants: Math.min(prev.merchants + 18 / steps, 18),
          accuracy: Math.min(prev.accuracy + 99.98 / steps, 99.98),
          agents: Math.min(prev.agents + 4 / steps, 4),
        }));
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isInView]);

  const metrics = [
    {
      icon: <TrendingUp className="h-6 w-6 text-electric-blue" />,
      value: `₹${counts.revenue.toFixed(0)}M`,
      label: "Revenue Protected",
      prefix: "₹",
      suffix: "M",
    },
    {
      icon: <Users className="h-6 w-6 text-electric-blue" />,
      value: `${counts.merchants.toFixed(0)}K`,
      label: "Merchants",
      prefix: "",
      suffix: "K",
    },
    {
      icon: <Target className="h-6 w-6 text-electric-blue" />,
      value: `${counts.accuracy.toFixed(2)}%`,
      label: "Accuracy",
      prefix: "",
      suffix: "%",
    },
    {
      icon: <Bot className="h-6 w-6 text-electric-blue" />,
      value: `${counts.agents.toFixed(0)}`,
      label: "AI Agents",
      prefix: "",
      suffix: "",
    },
  ];

  return (
    <section ref={ref} className="py-20 relative">
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
            Our AI-powered platform processes millions of transactions daily, protecting revenue and optimizing operations for merchants worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="glass rounded-2xl p-8 glow-blue">
                <div className="flex justify-center mb-4">{metric.icon}</div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {metric.value}
                </div>
                <div className="text-gray-400">{metric.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}