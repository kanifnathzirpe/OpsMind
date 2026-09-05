"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Zap,
  HelpCircle,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  actionCard?: {
    title: string;
    description: string;
    buttonText: string;
    actionType: string;
  };
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
  codeBlock?: {
    language: string;
    code: string;
  };
  followUpQuestions?: string[];
}

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAction?: (actionType: string) => void;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-init",
    sender: "copilot",
    text: "Hello! I am your OpsMind Sentinel Copilot. I continuously monitor gateway authorization rates, card testing syndicates, and cash projections across your active merchants. How can I assist your operations today?",
    timestamp: "Just now",
    followUpQuestions: [
      "Summarize today's business",
      "Show fraud trends",
      "Why revenue dropped?",
    ],
  },
];

let messageCounter = 0;
function createMessageId(prefix: string) {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

const SUGGESTED_PROMPTS = [
  "Why revenue dropped?",
  "Summarize today's business",
  "Show fraud trends",
  "How much revenue recovered?",
  "Predict next week's cash flow",
];

export function CopilotDrawer({
  isOpen,
  onClose,
  onExecuteAction,
}: CopilotDrawerProps) {
  const [messages, setMessages] = React.useState<Message[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isThinking, setIsThinking] = React.useState(false);
  const [thinkingStep, setThinkingStep] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating, isThinking]);

  // Streaming typewriter simulator
  const streamMessageText = (
    fullText: string,
    metadata?: Partial<Message>
  ) => {
    const msgId = createMessageId("stream");
    const words = fullText.split(" ");
    let currentWordIndex = 0;

    const newMsg: Message = {
      id: msgId,
      sender: "copilot",
      text: "",
      timestamp: "Just now",
      isStreaming: true,
      ...metadata,
    };

    setMessages((prev) => [...prev, newMsg]);

    const interval = setInterval(() => {
      currentWordIndex += 3;
      if (currentWordIndex >= words.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, text: fullText, isStreaming: false } : m
          )
        );
        setIsGenerating(false);
        setIsThinking(false);
      } else {
        const partialText = words.slice(0, currentWordIndex).join(" ");
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, text: partialText } : m))
        );
      }
    }, 32);
  };

  const handleSendMessage = (userQuery: string) => {
    if (!userQuery.trim() || isGenerating) return;

    const query = userQuery.trim();
    const userMsg: Message = {
      id: createMessageId("msg"),
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsGenerating(true);
    setIsThinking(true);
    setThinkingStep("Accessing multi-currency ledger & Sentinel telemetry...");

    setTimeout(() => {
      setThinkingStep("Synthesizing neural fraud weights & 3DS latency models...");
    }, 450);

    setTimeout(() => {
      setIsThinking(false);
      const lower = query.toLowerCase();

      if (lower.includes("revenue") && (lower.includes("drop") || lower.includes("fall") || lower.includes("why"))) {
        const fullText =
          "### Revenue Diagnostic: Stripe EU 3DS Latency Anomaly\n\nGross volume is up **+14.2% today ($148,290.40)**, but telemetry detected an authorization drop in EU cross-border checkouts between 12:00 and 13:40 UTC.\n\n- **Root Cause:** European issuer 3DS authentication latency spiked by +280ms.\n- **Impact:** 28 customer checkouts dropped off (~$6,200 GMV).\n- **Remediation:** Sentinel dynamic routing rerouted 214 pending checkouts to Adyen Amsterdam.";
        streamMessageText(fullText, {
          tableData: {
            headers: ["Gateway Rail", "Auth Rate", "Latency", "Status"],
            rows: [
              ["Stripe US", "96.4%", "112ms", "Optimal"],
              ["Stripe EU", "84.2%", "392ms", "Degraded (Rerouted)"],
              ["Adyen EU", "99.4%", "88ms", "Optimal"],
            ],
          },
          actionCard: {
            title: "Lock Adyen as Primary EU Rail",
            description: "Keep 100% of EU cross-border checkouts on Adyen for the next 6 hours.",
            buttonText: "Enforce Dynamic Routing",
            actionType: "lock_adyen",
          },
          followUpQuestions: [
            "Inspect Adyen Amsterdam auth logs?",
            "Simulate interchange fee impact?",
            "Show fraud trends",
          ],
        });
      } else if (lower.includes("summarize") || lower.includes("summary") || lower.includes("business")) {
        const fullText =
          "### Executive Summary: Business Health & Multi-Gateway Operations\n\n- **Gross Revenue Today:** $148,290.40 (+14.2% vs 30-day baseline)\n- **Autonomous Recoveries:** $18,420.00 salvaged via ML smart retries\n- **Fraud Prevention:** 100% neutralized, $38,420 attack volume blocked\n- **Cash Position:** $1.429M across Operating & Treasury reserves (18.4 months runway)\n\n**Sentinel Assessment:** Zero critical vulnerabilities detected. All primary gateways operating within SLA limits.";
        streamMessageText(fullText, {
          actionCard: {
            title: "Export Executive Board PDF",
            description: "Download a signed PDF deck ready for audit committees and investors.",
            buttonText: "Generate PDF Report",
            actionType: "export_pdf",
          },
          followUpQuestions: [
            "How much revenue recovered?",
            "Predict next week's cash flow",
            "Show fraud trends",
          ],
        });
      } else if (lower.includes("fraud") || lower.includes("trends")) {
        const fullText =
          "### Sentinel Threat Analysis & Attack Vectors\n\nIn the last 24 hours, OpsMind intercepted an automated card testing campaign targeting guest checkout API endpoints.\n\n- **Attacker Profile:** ASN 14061 (Frankfurt/Amsterdam TOR exit nodes).\n- **Attack Pattern:** High-velocity sequential BIN probing (400022 and 411111).\n- **Protective Action Taken:** Pre-auth behavioral barrier quarantined 34 attempts without merchant fee penalties.";
        streamMessageText(fullText, {
          codeBlock: {
            language: "json",
            code: `{\n  "rule_id": "sentinel_auto_quarantine_v3",\n  "attack_vector": "TOR_EXIT_NODE_PROBING",\n  "asn_blacklisted": 14061,\n  "prevented_chargebacks": 34,\n  "false_positive_probability": "0.001%"\n}`,
          },
          actionCard: {
            title: "Tighten Cross-Border Velocity Rule",
            description: "Lower threshold cutoff from 75 to 70 for guest checkouts without 3DS.",
            buttonText: "Apply Strict Rule",
            actionType: "strict_rule",
          },
          followUpQuestions: [
            "Why revenue dropped?",
            "How much revenue recovered?",
          ],
        });
      } else if (lower.includes("recovered") || lower.includes("recover")) {
        const fullText =
          "### Autonomous Payment Recovery Telemetry\n\nOpsMind has recovered **$18,420.00** today through intelligent smart-retrying.\n\n- **Capture Rate:** 94.2% on soft declines (insufficient funds, velocity exceeded).\n- **Pipeline Status:** 4 recoverable subscriptions totaling **$12,030.50** remain queued for cardholder payroll cycles.";
        streamMessageText(fullText, {
          tableData: {
            headers: ["Customer", "Amount", "Decline Code", "Success Prob"],
            rows: [
              ["Quantum Dynamics Ltd", "$2,840.00", "insufficient_funds", "92%"],
              ["Nordic Media Group", "$4,190.50", "do_not_honor", "84%"],
              ["Solaris Ventures", "$1,520.00", "card_velocity_exceeded", "96%"],
              ["Apex Retailers Inc", "$3,480.00", "expired_card", "71%"],
            ],
          },
          actionCard: {
            title: "Trigger Multi-Rail Recovery Dunning",
            description: "Execute automated smart-routing retries across remaining 4 invoices.",
            buttonText: "Recover All ($12,030.50)",
            actionType: "batch_recover",
          },
          followUpQuestions: [
            "Predict next week's cash flow",
            "Summarize today's business",
          ],
        });
      } else if (lower.includes("predict") || lower.includes("forecast") || lower.includes("cash")) {
        const fullText =
          "### 7-Day & 30-Day Liquidity Forecast\n\n- **Projected Net Inflows (Next 7 Days):** +$214,800.00\n- **Safe-to-Spend Liquidity:** $420,000.00\n- **Operating Runway:** 18.4 months (Net positive burn rate)\n\n### Upcoming Treasury Milestones\n1. **+$84,200** Stripe settlement landing tomorrow at 06:00 UTC.\n2. **-$58,400** Gusto payroll and contractor disbursement on Friday.\n3. **+$48,000** Enterprise contract payment from Apex Labs next Tuesday.";
        streamMessageText(fullText, {
          followUpQuestions: [
            "Summarize today's business",
            "Why revenue dropped?",
          ],
        });
      } else {
        const fullText = `I analyzed your inquiry: **"${query}"** across all active payment gateways.\n\n- Gross volume is operating at **$148,290.40** with **0% fraud leakage**.\n- 34 attack attempts were successfully neutralized by Sentinel.\n- Cash reserves stand strong at **$1.429M**.\n\nWould you like me to simulate an interchange rate optimization or review customer churn?`;
        streamMessageText(fullText, {
          followUpQuestions: [
            "Summarize today's business",
            "Show fraud trends",
            "Predict next week's cash flow",
          ],
        });
      }
    }, 850);
  };

  const handleActionClick = (card: Message["actionCard"]) => {
    if (!card) return;
    toast.success(`Copilot executed: ${card.title}`);
    onExecuteAction?.(card.actionType);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-label="OpsMind AI Copilot Drawer"
          className={cn(
            "fixed z-50 flex flex-col bg-[#0c1228]/95 border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-2xl transition-all duration-300 overflow-hidden",
            isExpanded
              ? "inset-4 sm:inset-10"
              : "bottom-4 right-4 w-full sm:w-[480px] h-[610px] max-w-[calc(100vw-2rem)]"
          )}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 bg-gradient-to-r from-blue-950/40 via-transparent to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-white">
                    OpsMind AI Copilot
                  </span>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-400">
                    Live
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">
                  Autonomous Operating Intelligence (⌘J)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                title={isExpanded ? "Collapse window" : "Expand window"}
              >
                {isExpanded ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Suggested Prompts Chips */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06] bg-black/30 overflow-x-auto text-[10px] scrollbar-none">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                disabled={isGenerating}
                className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[92%]",
                  msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-900/30"
                      : "bg-white/[0.05] border border-white/[0.08] text-gray-200 rounded-bl-none"
                  )}
                >
                  {/* Markdown text */}
                  <div className="space-y-2">
                    {msg.text.split("\n\n").map((para, idx) => {
                      if (para.startsWith("### ")) {
                        return (
                          <h4
                            key={idx}
                            className="font-bold text-white text-xs tracking-tight text-blue-300"
                          >
                            {para.replace("### ", "")}
                          </h4>
                        );
                      }
                      if (para.startsWith("- ") || para.startsWith("1. ")) {
                        return (
                          <ul key={idx} className="list-disc list-inside space-y-1 text-[11px] text-gray-300 pl-1">
                            {para.split("\n").map((line, liIdx) => (
                              <li key={liIdx}>
                                {line.replace(/^[-\d.]+\s*/, "")}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={idx} className="text-[11px] text-gray-300">
                          {para}
                        </p>
                      );
                    })}
                  </div>

                  {/* Table Data */}
                  {msg.tableData && (
                    <div className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40">
                      <table className="w-full text-[10px] text-left">
                        <thead className="border-b border-white/10 bg-white/[0.02] text-gray-400 font-semibold">
                          <tr>
                            {msg.tableData.headers.map((h, i) => (
                              <th key={i} className="px-2.5 py-1.5">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {msg.tableData.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-white/[0.02]">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-2.5 py-1 text-gray-300 font-mono">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Code Block */}
                  {msg.codeBlock && (
                    <div className="mt-2.5 rounded-lg border border-white/10 bg-black/60 p-2.5 font-mono text-[10px] text-cyan-300 overflow-x-auto">
                      <pre>{msg.codeBlock.code}</pre>
                    </div>
                  )}

                  {/* Action Card Button */}
                  {msg.actionCard && (
                    <div className="mt-3 rounded-xl border border-blue-500/30 bg-blue-500/[0.08] p-3 space-y-2">
                      <div className="flex items-center gap-1.5 text-blue-300 font-semibold text-[11px]">
                        <Zap className="h-3.5 w-3.5" />
                        <span>{msg.actionCard.title}</span>
                      </div>
                      <p className="text-[10px] text-gray-300 leading-normal">
                        {msg.actionCard.description}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleActionClick(msg.actionCard)}
                        className="h-7 w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-[10px] shadow-sm shadow-blue-900/40"
                      >
                        {msg.actionCard.buttonText}
                      </Button>
                    </div>
                  )}

                  {/* Follow-up Question Chips */}
                  {msg.followUpQuestions && msg.followUpQuestions.length > 0 && !msg.isStreaming && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.06] space-y-1.5">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <HelpCircle className="h-3 w-3 text-cyan-400" />
                        <span>Suggested follow-ups:</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUpQuestions.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSendMessage(q)}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all text-left"
                          >
                            {q} →
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.isStreaming && (
                    <span className="inline-block h-3 w-1.5 ml-1 bg-blue-400 animate-pulse align-middle" />
                  )}
                </div>

                <span className="text-[9px] text-gray-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Thinking Animation */}
            {isThinking && (
              <div className="flex items-center gap-2.5 text-xs text-blue-400 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 w-fit">
                <div className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <Cpu className="relative h-3.5 w-3.5 text-cyan-400 animate-spin" />
                </div>
                <span className="text-[11px] font-medium">{thinkingStep}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-white/[0.08] bg-black/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask Sentinel Copilot (e.g. 'Why revenue dropped?')..."
                className="bg-white/[0.04] border-white/10 text-xs text-white placeholder:text-gray-400 focus-visible:ring-blue-500"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputVal.trim() || isGenerating}
                className="h-9 w-9 bg-blue-600 hover:bg-blue-500 text-white shrink-0 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
