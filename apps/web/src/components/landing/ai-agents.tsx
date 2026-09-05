"use client";

import { motion } from "framer-motion";
import { RefreshCw, Shield, DollarSign, MessageSquare } from "lucide-react";

export function AIAgents() {
  const agents = [
    {
      icon: <RefreshCw className="h-8 w-8 text-electric-blue" />,
      name: "Revenue Recovery Agent",
      description: "Automatically detects and recovers failed payments using intelligent retry strategies and payment method optimization.",
      status: "Active",
      statusColor: "emerald",
      features: ["Smart retry logic", "Payment routing", "Fallback management"],
    },
    {
      icon: <Shield className="h-8 w-8 text-electric-blue" />,
      name: "Fraud Sentinel",
      description: "Real-time fraud detection using machine learning to identify and block suspicious transactions before they impact your business.",
      status: "Active",
      statusColor: "emerald",
      features: ["ML-powered detection", "Real-time blocking", "Risk scoring"],
    },
    {
      icon: <DollarSign className="h-8 w-8 text-electric-blue" />,
      name: "Finance Controller",
      description: "AI-powered cash flow forecasting and financial insights to help you make data-driven business decisions.",
      status: "Active",
      statusColor: "emerald",
      features: ["Cash forecasting", "Revenue prediction", "Financial insights"],
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-electric-blue" />,
      name: "Merchant Copilot",
      description: "Natural language interface to query your business data, get insights, and automate workflows using AI.",
      status: "Active",
      statusColor: "emerald",
      features: ["Natural language", "Data queries", "Workflow automation"],
    },
  ];

  return (
    <section id="agents" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            AI-Powered Agents
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Autonomous agents that work 24/7 to protect and grow your business
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {agents.map((agent, i) => (
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
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 rounded-xl bg-electric-blue/10">
                    {agent.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-sm font-medium">{agent.status}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">{agent.name}</h3>
                <p className="text-gray-400 mb-6">{agent.description}</p>

                <div className="space-y-2">
                  {agent.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-electric-blue rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}