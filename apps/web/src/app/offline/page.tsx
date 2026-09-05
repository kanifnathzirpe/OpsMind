"use client";

import * as React from "react";
import Link from "next/link";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] p-4 text-white">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0d1226]/80 p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <WifiOff className="h-10 w-10" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Offline Mode</h1>
          <p className="text-sm text-gray-400 mt-2">
            You appear to be offline or disconnected from the OpsMind network. Cached records remain safely encrypted in local storage.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-600/30"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Reconnecting..." : "Check Connection"}
          </Button>

          <Link href="/dashboard">
            <Button
              variant="outline"
              className="w-full h-10 border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] hover:text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Cached Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
