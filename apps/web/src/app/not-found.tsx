"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] p-4 text-white">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0d1226]/80 p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: "12s" }} />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
            Error 404 • Resource Not Found
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-1">Page Out of Range</h1>
          <p className="text-sm text-gray-400 mt-2">
            The multi-rail route or resource you requested is not indexed on this OpsMind gateway node.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-600/30">
              <Home className="mr-2 h-4 w-4" />
              Return to Autonomous OS
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full h-10 border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] hover:text-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Route
          </Button>
        </div>
      </div>
    </div>
  );
}