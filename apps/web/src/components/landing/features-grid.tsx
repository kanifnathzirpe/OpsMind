"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  RefreshCw,
  TrendingUp,
  Shield,
  FileText,
  Database,
  Workflow,
  AlertTriangle,
  Mail,
  Search,
} from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      icon: <Activity className="h-6 w-6 text-electric-blue" />,
      title: "Realtime Monitoring",
      description: "Track your business metrics in real-time with instant updates and alerts.",
    },
    {
      icon: <Bell className="h-6 w-6 text-electric-blue" />,
      title: "Smart Alerts",
      description: "Intelligent notifications for critical events and opportunities.",
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-electric-blue" />,
      title: "Payment Recovery",
      description: "Automated failed payment recovery with intelligent retry strategies.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-electric-blue" />,
      title: "Cash Prediction",
      description: "AI-powered cash flow forecasting for better financial planning.",
    },
    {
      icon: <Shield className="h-6 w-6 text-electric-blue" />,
      title: "Fraud Detection",
      description: "Machine learning models to identify and prevent fraudulent transactions.",
    },
    {
      icon: <FileText className="h-6 w-6 text-electric-blue" />,
      title: "AI Reports",
      description: "Automated reports with actionable insights and recommendations.",
    },
    {
      icon: <Database className="h-6 w-6 text-electric-blue" />,
      title: "Invoice Analysis",
      description: "Intelligent invoice processing and anomaly detection.",
    },
    {
      icon: <Search className="h-6 w-6 text-electric-blue" />,
      title: "Knowledge Base",
      description: "AI-powered search across your business data and documents.",
    },
    {
      icon: <Workflow className="h-6 w-6 text-electric-blue" />,
      title: "Workflow Automation",
      description: "Automate repetitive tasks with custom AI workflows.",
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-electric-blue" />,
      title: "Risk Score",
      description: "Comprehensive risk assessment for transactions and customers.",
    },
    {
      icon: <Mail className="h-6 w-6 text-electric-blue" />,
      title: "Email Automation",
      description: "AI-generated emails for customer communication and follow-ups.",
    },
    {
      icon: <Search className="h-6 w-6 text-electric-blue" />,
      title: "Natural Language Search",
      description: "Query your data using natural language with AI understanding.",
    },
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to run your business with AI intelligence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="gradient-border rounded-2xl p-1"
            >
              <div className="glass rounded-2xl p-6 h-full">
                <div className="p-3 rounded-xl bg-electric-blue/10 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}