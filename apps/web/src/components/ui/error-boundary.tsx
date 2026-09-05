"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode);
  autoRetry?: boolean;
  name?: string;
  className?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private autoRetryTimer: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`ErrorBoundary caught in [${this.props.name || "Component"}]:`, error, errorInfo);
    
    // Fire toast notification once
    toast.error(`Telemetry Error in ${this.props.name || "Dashboard"}`, {
      description: error.message || "An unexpected error occurred in component rendering",
    });

    this.props.onError?.(error, errorInfo);

    // If autoRetry enabled and we haven't retried yet, try once after 1.5s
    if (this.props.autoRetry && this.state.retryCount === 0) {
      this.autoRetryTimer = setTimeout(() => {
        this.handleReset();
      }, 1500);
    }
  }

  componentWillUnmount(): void {
    if (this.autoRetryTimer) {
      clearTimeout(this.autoRetryTimer);
    }
  }

  handleReset = (): void => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(
          this.state.error || new Error("Unknown error"),
          this.handleReset
        );
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-500/20 bg-gradient-to-b from-rose-950/20 via-rose-900/10 to-transparent backdrop-blur-md select-none my-4",
            this.props.className
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 mb-3 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <h4 className="text-sm font-semibold text-white tracking-tight mb-1">
            {this.props.name ? `${this.props.name} encountered an error` : "Component rendering error"}
          </h4>

          <p className="text-xs text-gray-400 max-w-sm mb-4 leading-relaxed">
            {this.state.error?.message || "Autonomous engine could not mount this component safely."}
          </p>

          <Button
            size="sm"
            variant="outline"
            onClick={this.handleReset}
            className="h-8 text-xs border-rose-500/30 bg-rose-500/10 text-rose-300 hover:text-white hover:bg-rose-500/20 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            <span>Try Again</span>
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
