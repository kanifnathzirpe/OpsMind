"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, AlertTriangle, MessageSquare, BarChart3, Sparkles } from "lucide-react";

export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Interactive Dashboard
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real-time insights and AI-powered analytics at your fingertips
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-8 glow-blue"
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-electric-blue to-emerald-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl">OpsMind Dashboard</h3>
                <p className="text-gray-400 text-sm">Real-time business intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm">Live</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <TrendingUp />, label: "Revenue", value: "$127,453", change: "+23%" },
              { icon: <DollarSign />, label: "Cash Flow", value: "$89,234", change: "+12%" },
              { icon: <AlertTriangle />, label: "Fraud Alerts", value: "3", change: "-45%" },
              { icon: <MessageSquare />, label: "AI Chats", value: "1,234", change: "+67%" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2 text-electric-blue">
                  {stat.icon}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
                <div className="text-white font-bold text-xl">{stat.value}</div>
                <div className="text-emerald-400 text-xs">{stat.change}</div>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 glass rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Revenue Analytics</h4>
                <BarChart3 className="h-5 w-5 text-electric-blue" />
              </div>
              <div className="h-48 flex items-end justify-between gap-2">
                {[30, 45, 35, 60, 40, 75, 50, 80, 55, 90, 65, 100].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex-1 bg-gradient-to-t from-electric-blue to-emerald-400 rounded-t"
                  />
                ))}
              </div>
            </motion.div>

            {/* AI Chat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-electric-blue" />
                <h4 className="text-white font-semibold">AI Copilot</h4>
              </div>
              <div className="space-y-3">
                <div className="bg-electric-blue/10 rounded-lg p-3">
                  <p className="text-white text-sm">Show me revenue trends</p>
                </div>
                <div className="bg-emerald-500/10 rounded-lg p-3">
                  <p className="text-gray-300 text-sm">Revenue increased 23% this month</p>
                </div>
                <div className="bg-electric-blue/10 rounded-lg p-3">
                  <p className="text-white text-sm">What about fraud?</p>
                </div>
              </div>
            </motion.div>

            {/* Recovery Opportunities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-6"
            >
              <h4 className="text-white font-semibold mb-4">Recovery Opportunities</h4>
              <div className="space-y-3">
                {[
                  { amount: "$2,340", reason: "Failed payment retry" },
                  { amount: "$1,890", reason: "Subscription recovery" },
                  { amount: "$3,450", reason: "Chargeback dispute" },
                ].map((opp, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-electric-blue/5 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{opp.amount}</div>
                      <div className="text-gray-400 text-xs">{opp.reason}</div>
                    </div>
                    <div className="text-emerald-400 text-sm">Recover</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Merchant Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="glass rounded-xl p-6"
            >
              <h4 className="text-white font-semibold mb-4">Merchant Health Score</h4>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 0.94 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">94</span>
                  </div>
                </div>
              </div>
              <div className="text-center text-emerald-400 text-sm">Excellent</div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="glass rounded-xl p-6"
            >
              <h4 className="text-white font-semibold mb-4">Recent Alerts</h4>
              <div className="space-y-3">
                {[
                  { type: "fraud", message: "Suspicious transaction blocked" },
                  { type: "recovery", message: "Payment recovered successfully" },
                  { type: "info", message: "Weekly report ready" },
                ].map((alert, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-electric-blue/5 rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        alert.type === "fraud"
                          ? "bg-amber-400"
                          : alert.type === "recovery"
                          ? "bg-emerald-400"
                          : "bg-electric-blue"
                      }`}
                    />
                    <div className="text-gray-300 text-sm">{alert.message}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* SVG Gradient Definition */}
      <svg className="hidden">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
}