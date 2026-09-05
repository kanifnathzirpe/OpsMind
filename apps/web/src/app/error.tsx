"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("OpsMind Application Runtime Error:", error);
    toast.error("Runtime exception intercepted by Sentinel boundary");
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] p-4 text-white">
      <div className="max-w-md w-full rounded-2xl border border-rose-500/20 bg-[#0d1226]/80 p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold">
            Status 500 • Internal Exception
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-1">Autonomous Kernel Halted</h1>
          <p className="text-sm text-gray-400 mt-2">
            An unhandled runtime error was intercepted by the OpsMind global error supervisor.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-gray-500 mt-1">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <Button
            onClick={reset}
            className="w-full h-10 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-medium shadow-lg shadow-rose-600/30"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart Process & Retry
          </Button>

          <Link href="/dashboard" className="w-full">
            <Button
              variant="outline"
              className="w-full h-10 border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] hover:text-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}