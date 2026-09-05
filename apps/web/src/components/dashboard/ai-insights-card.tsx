"use client";

import * as React from "react";
import {
  Sparkles,
  Bot,
  ArrowRight,
  Check,
  Zap,
  RefreshCw,
  Send,
} from "lucide-react";
import { AIInsight, COPILOT_SUGGESTED_PROMPTS } from "@/lib/dashboard-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AIInsightsCardProps {
  insights: AIInsight[];
  className?: string;
  onOpenCopilot?: () => void;
}

export function AIInsightsCard({
  insights: initialInsights,
  className,
  onOpenCopilot,
}: AIInsightsCardProps) {
  const [insights, setInsights] = React.useState<AIInsight[]>(initialInsights);
  const [promptInput, setPromptInput] = React.useState("");
  const [isAnswering, setIsAnswering] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);
  const [copilotReply, setCopilotReply] = React.useState<string | null>(null);

  const handleReScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const newInsight: AIInsight = {
        id: `ins-${Date.now()}`,
        title: "Zero-Auth Micro-Charge Optimization Detected",
        summary: "Pre-auth token verification on cross-border checkouts reduced bank decline friction by 14.8%.",
        impact: "+$9,120 rescued volume",
        metric: "98.2% Authorization",
        category: "routing",
        confidence: 97,
        suggestedAction: "Enforce zero-auth validation on cards with CVC check",
        timestamp: "Just now",
      };
      setInsights((prev) => [newInsight, ...prev]);
      toast.success("Telemetry re-scanned: New AI optimization insight generated!");
    }, 1100);
  };

  const handleApplyAction = (insightId: string, actionName: string) => {
    setInsights((prev) =>
      prev.map((ins) =>
        ins.id === insightId ? { ...ins, isApplied: true } : ins
      )
    );
    toast.success(`Copilot rule enforced: "${actionName}"`);
  };

  const handleAskCopilot = (questionText: string) => {
    if (!questionText.trim()) return;
    setIsAnswering(true);
    setCopilotReply(null);

    // Simulate conversational intelligence streaming reply
    setTimeout(() => {
      setIsAnswering(false);
      if (questionText.toLowerCase().includes("cash") || questionText.toLowerCase().includes("runway")) {
        setCopilotReply(
          "Projected cash balance on Sep 30 is $1,663,800 (+16.4% MoM). After reserving $58.4k for payroll on Sep 8 and $16.5k for AWS compute on Sep 14, your safe-to-spend buffer stands at $420,000 with 18.4 months of runway."
        );
      } else if (questionText.toLowerCase().includes("fraud") || questionText.toLowerCase().includes("risk")) {
        setCopilotReply(
          "In the last 24h, Fraud Sentinel blocked 34 automated card-testing probes originating from ASN 14061 (Frankfurt/Amsterdam proxies). Total exposure averted: $86,410. False-positive rate remains at 0.00%."
        );
      } else if (questionText.toLowerCase().includes("failed") || questionText.toLowerCase().includes("ops-90118")) {
        setCopilotReply(
          "Order OPS-90118 failed due to high-velocity card testing from a known proxy (Risk Score: 94). Automated block was enforced. No recovery recommended for this unauthorized attempt."
        );
      } else {
        setCopilotReply(
          `OpsMind Copilot analyzed your business telemetry: Gross revenue is trending +14.2% today with 94.2% AI recovery on soft declines. Multi-gateway failover to Adyen is active and operating at 99.4% auth rate.`
        );
      }
      setPromptInput("");
    }, 700);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-950/20 via-white/[0.02] to-transparent p-5 backdrop-blur-xl",
        "relative overflow-hidden shadow-2xl shadow-blue-500/5",
        className
      )}
    >
      {/* Decorative ambient aura */}
      <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <span>OpsMind AI Intelligence</span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                {insights.length} Active Insights
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Autonomous agents analyzing gateway performance, card declines & fraud
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          disabled={isScanning}
          onClick={handleReScan}
          className="h-7 text-xs text-gray-400 hover:text-white hover:bg-white/5"
        >
          <RefreshCw className={cn("h-3.5 w-3.5 mr-1", isScanning && "animate-spin text-blue-400")} />
          <span>{isScanning ? "Scanning..." : "Re-scan"}</span>
        </Button>
      </div>

      {/* Insights List */}
      <div className="space-y-3 mb-5 max-h-[380px] overflow-y-auto pr-1">
        {insights.map((ins) => {
          return (
            <div
              key={ins.id}
              className={cn(
                "group relative rounded-xl border p-3.5 transition-all text-xs",
                ins.isApplied
                  ? "bg-emerald-500/[0.04] border-emerald-500/20 opacity-80"
                  : "bg-white/[0.02] border-white/[0.08] hover:border-blue-500/30 hover:bg-white/[0.04]"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider",
                      ins.category === "routing"
                        ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        : ins.category === "recovery"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : ins.category === "fraud"
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                    )}
                  >
                    {ins.category}
                  </span>
                  <span className="font-semibold text-white text-xs">
                    {ins.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-semibold text-emerald-400">
                    {ins.impact}
                  </span>
                  <span className="text-gray-400">• {ins.timestamp}</span>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed text-[11px] mb-2.5">
                {ins.summary}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                  <Zap className="h-3 w-3 text-blue-400" />
                  <span>Agent recommendation: </span>
                  <span className="text-gray-200 font-medium">{ins.suggestedAction}</span>
                </div>

                {ins.isApplied ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                    <Check className="h-3.5 w-3.5" />
                    <span>Rule Enforced</span>
                  </span>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleApplyAction(ins.id, ins.suggestedAction)}
                    className="h-6 px-2.5 text-[11px] bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    <span>Apply Rule</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Quick-Ask Copilot Input Bar */}
      <div className="rounded-xl border border-white/[0.08] bg-black/40 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold text-white">
              Ask Copilot Assistant
            </span>
          </div>
          {onOpenCopilot && (
            <button
              onClick={onOpenCopilot}
              className="text-[10px] text-blue-400 hover:underline"
            >
              Open Full Chat
            </button>
          )}
        </div>

        {/* Suggested question chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {COPILOT_SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPromptInput(prompt);
                handleAskCopilot(prompt);
              }}
              className="text-[10px] rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-blue-600/20 hover:border-blue-500/30 hover:text-white px-2.5 py-1 text-gray-400 transition-colors text-left truncate max-w-full"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input & Submit */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskCopilot(promptInput);
          }}
          className="relative flex items-center"
        >
          <Input
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Ask about runway, high-risk orders, chargeback prevention..."
            className="h-9 pr-10 text-xs bg-white/[0.04] border-white/10 text-white placeholder:text-gray-400 rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!promptInput.trim() || isAnswering}
            className="absolute right-2 p-1.5 rounded-md text-blue-400 hover:text-white hover:bg-blue-600/40 disabled:opacity-30 transition-all"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Streaming Copilot Reply Output */}
        {(isAnswering || copilotReply) && (
          <div className="mt-3 p-3 rounded-lg bg-blue-600/10 border border-blue-500/20 text-xs animate-in fade-in">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              <span>Copilot Synthesizer</span>
            </div>
            {isAnswering ? (
              <p className="text-gray-400 text-xs italic">
                Querying cross-gateway ledger & anomaly models...
              </p>
            ) : (
              <p className="text-gray-200 text-xs leading-relaxed">
                {copilotReply}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
