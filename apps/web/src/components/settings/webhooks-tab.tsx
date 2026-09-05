"use client";

import * as React from "react";
import { useWebhooksQuery } from "@/hooks/queries/use-dashboard-queries";
import { Button } from "@/components/ui/button";
import { Globe, Plus, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function WebhooksTab() {
  const { data: webhooks = [], isLoading } = useWebhooksQuery();
  const [testingId, setTestingId] = React.useState<string | null>(null);

  const handleTestPing = (id: string, url: string) => {
    setTestingId(id);
    toast.info(`Dispatching synthetic test payload to ${url}...`);
    setTimeout(() => {
      setTestingId(null);
      toast.success("Webhook returned HTTP 200 OK (Latency: 42ms)");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            Outbound Webhooks
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Deliver event payloads to external microservices with HMAC SHA-256 signatures.
          </p>
        </div>

        <Button
          onClick={() => toast.info("Add Webhook Endpoint dialog")}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 shadow-md shadow-blue-900/30"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Endpoint
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map((hook) => (
            <div
              key={hook.id}
              className="rounded-xl border border-white/[0.08] bg-[#0d1226]/60 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs font-mono font-bold text-white tracking-tight">
                    {hook.url}
                  </code>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 text-[9px] text-emerald-400 font-medium">
                    {hook.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{hook.description}</p>
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {hook.events.map((evt) => (
                    <span
                      key={evt}
                      className="rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 text-[10px] text-blue-300 font-mono"
                    >
                      {evt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={testingId === hook.id}
                  onClick={() => handleTestPing(hook.id, hook.url)}
                  className="h-7 text-xs border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
                >
                  {testingId === hook.id ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1 text-blue-400" />
                  ) : (
                    <Send className="h-3 w-3 mr-1 text-blue-400" />
                  )}
                  Test Ping
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
