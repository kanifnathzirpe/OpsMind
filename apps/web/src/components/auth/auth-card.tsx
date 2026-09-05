"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050816] px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-blue-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[400px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 left-10 h-64 w-64 rounded-full bg-purple-600/5 blur-[90px]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                OpsMind
                <span className="rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-blue-400">
                  AI OS
                </span>
              </span>
              <span className="text-[10px] tracking-wider text-gray-400 uppercase font-mono">
                Autonomous Commerce
              </span>
            </div>
          </Link>
        </div>

        {/* Card Body */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d1226]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/60 relative">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-400">{subtitle}</p>
          </div>

          {children}

          {footer && (
            <div className="mt-6 border-t border-white/[0.06] pt-5 text-center text-xs text-gray-400">
              {footer}
            </div>
          )}
        </div>

        {/* Security badge at bottom */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>SOC-2 Type II Certified • 256-bit TLS Gateway</span>
        </div>
      </motion.div>
    </div>
  );
}
