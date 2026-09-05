"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Brain, Zap, CheckCircle, Bell } from "lucide-react";

export function MerchantProblems() {
  const steps = [
    {
      icon: <AlertTriangle className="h-6 w-6 text-amber-400" />,
      title: "Problem Detected",
      description: "Failed payment or suspicious activity identified",
      color: "amber",
    },
    {
      icon: <Brain className="h-6 w-6 text-electric-blue" />,
      title: "AI Detects",
      description: "Machine learning models analyze the issue in real-time",
      color: "blue",
    },
    {
      icon: <Zap className="h-6 w-6 text-electric-blue" />,
      title: "AI Reasons",
      description: "Contextual analysis determines the best course of action",
      color: "blue",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-emerald-400" />,
      title: "AI Executes",
      description: "Automated recovery or fraud prevention actions taken",
      color: "emerald",
    },
    {
      icon: <Bell className="h-6 w-6 text-electric-blue" />,
      title: "Merchant Notified",
      description: "Real-time alerts with actionable insights delivered",
      color: "blue",
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
            How OpsMind Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From problem detection to resolution, our AI agents handle it all autonomously
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-electric-blue via-emerald-500 to-electric-blue" />

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex items-center ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Desktop: Left/Right Content */}
                <div className="hidden md:block flex-1" />
                
                {/* Center Icon */}
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-emerald-500 border-4 border-[#050816] z-10">
                  {step.icon}
                </div>

                <div className="hidden md:block flex-1" />

                {/* Mobile: Full Width */}
                <div className="md:hidden flex items-center gap-4 w-full">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-emerald-500 flex-shrink-0">
                    {step.icon}
                  </div>
                  <div className="glass rounded-xl p-6 flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>

                {/* Desktop: Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`hidden md:block glass rounded-xl p-6 max-w-md ${
                    i % 2 === 0 ? "mr-auto" : "ml-auto"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-${step.color}-500/20`}>
                      {step.icon}
                    </div>
                    <h3 className="text-white font-semibold text-lg">{step.title}</h3>
                  </div>
                  <p className="text-gray-400">{step.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}