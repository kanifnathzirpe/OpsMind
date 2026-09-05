"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Shield, DollarSign, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  const floatingCards = [
    {
      icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
      label: "Revenue Recovered",
      value: "$2.4M",
      change: "+23%",
      delay: 0,
    },
    {
      icon: <Shield className="h-5 w-5 text-electric-blue" />,
      label: "Fraud Blocked",
      value: "1,847",
      change: "+12%",
      delay: 0.2,
    },
    {
      icon: <DollarSign className="h-5 w-5 text-amber-400" />,
      label: "Cash Forecast",
      value: "$8.9M",
      change: "+8%",
      delay: 0.4,
    },
    {
      icon: <Activity className="h-5 w-5 text-emerald-400" />,
      label: "Merchant Health",
      value: "94%",
      change: "+5%",
      delay: 0.6,
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 noise">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050816]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-gray-300"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              AI-Powered Business Intelligence
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-white leading-tight"
            >
              AI Operating System
              <br />
              <span className="gradient-text">for Modern Merchants</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-400 max-w-lg"
            >
              Recover lost revenue. Stop fraud. Forecast cash. Manage operations. All from one AI workspace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 font-medium text-lg px-8 glow-blue w-full sm:w-auto"
                >
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 font-medium text-lg px-8"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-blue to-emerald-500 border-2 border-[#050816]"
                    />
                  ))}
                </div>
                <span>18K+ Merchants</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-1 h-4 bg-emerald-400 rounded-full"
                      style={{ marginLeft: i > 1 ? "2px" : "0" }}
                    />
                  ))}
                </div>
                <span>4.9/5 Rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="relative glass rounded-2xl p-6 glow-blue">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric-blue to-emerald-500 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Dashboard</div>
                    <div className="text-gray-400 text-sm">Real-time Analytics</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>

              {/* Chart Area */}
              <div className="h-48 mb-6 rounded-lg bg-gradient-to-br from-electric-blue/10 to-emerald-500/10 border border-white/10 flex items-end justify-between p-4">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    className="w-8 bg-gradient-to-t from-electric-blue to-emerald-400 rounded-t"
                  />
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Revenue", value: "$45.2K", change: "+12%" },
                  { label: "Orders", value: "1,234", change: "+8%" },
                  { label: "Conversion", value: "3.2%", change: "+15%" },
                  { label: "Avg Order", value: "$36.7", change: "+5%" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="glass rounded-lg p-4"
                  >
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                    <div className="text-white font-semibold text-lg">{stat.value}</div>
                    <div className="text-emerald-400 text-xs">{stat.change}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating Metric Cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay + 0.8 }}
                className={`absolute glass rounded-xl p-4 float-animation ${
                  i === 0 ? "-top-4 -right-4" : ""
                } ${i === 1 ? "top-1/2 -right-8" : ""} ${
                  i === 2 ? "bottom-1/4 -right-4" : ""
                } ${i === 3 ? "-bottom-4 left-1/2" : ""}`}
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  {card.icon}
                  <span className="text-gray-400 text-sm">{card.label}</span>
                </div>
                <div className="text-white font-bold text-xl">{card.value}</div>
                <div className="text-emerald-400 text-sm">{card.change}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}