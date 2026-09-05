"use client";

import * as React from "react";
import {
  useApiKeysQuery,
  useCreateApiKeyMutation,
  useRevokeApiKeyMutation,
} from "@/hooks/queries/use-dashboard-queries";
import { ApiKeyPermission } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export function ApiKeysTab() {
  const { data: apiKeys = [], isLoading } = useApiKeysQuery();
  const createMutation = useCreateApiKeyMutation();
  const revokeMutation = useRevokeApiKeyMutation();

  const [copiedKeyId, setCopiedKeyId] = React.useState<string | null>(null);
  const [isGenerateOpen, setIsGenerateOpen] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState("");
  const [selectedPermissions, setSelectedPermissions] = React.useState<ApiKeyPermission[]>([
    "read:analytics",
    "write:firewall",
  ]);
  const [revealedSecret, setRevealedSecret] = React.useState<{ name: string; secret: string } | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    const result = await createMutation.mutateAsync({
      name: newKeyName,
      permissions: selectedPermissions,
    });

    setRevealedSecret({ name: newKeyName, secret: result.secret });
    setNewKeyName("");
    setIsGenerateOpen(false);
  };

  const togglePermission = (perm: ApiKeyPermission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleRevoke = (id: string, name: string) => {
    if (confirm(`Revoke key "${name}"? Immediate disruption to associated integrations.`)) {
      revokeMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-blue-400" />
            API Keys & Secrets
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Authenticate merchant applications, automated payment routers, and ERP webhooks.
          </p>
        </div>

        <Button
          onClick={() => setIsGenerateOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 shadow-md shadow-blue-900/30"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Create New Secret Key
        </Button>
      </div>

      {/* Revealed Secret Banner if newly created */}
      {revealedSecret && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
            <AlertTriangle className="h-4 w-4" />
            <span>Save Your Secret Key: {revealedSecret.name}</span>
          </div>
          <p className="text-[11px] text-amber-200/80">
            This secret key will never be shown again. Copy and securely store it in your environment variables.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <code className="flex-1 rounded bg-black/40 px-3 py-1.5 text-xs font-mono text-emerald-400 border border-white/10 break-all">
              {revealedSecret.secret}
            </code>
            <Button
              size="sm"
              onClick={() => handleCopy(revealedSecret.secret, "revealed")}
              className="h-8 bg-white/10 hover:bg-white/20 text-white text-xs shrink-0"
            >
              {copiedKeyId === "revealed" ? (
                <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 mr-1" />
              )}
              Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRevealedSecret(null)}
              className="h-8 text-xs border-white/10 text-gray-400 shrink-0"
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Create New Key Modal / Form */}
      {isGenerateOpen && (
        <form
          onSubmit={handleGenerate}
          className="rounded-xl border border-blue-500/30 bg-blue-500/[0.04] p-4 space-y-3.5 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-blue-400" />
              Generate Production API Secret
            </h3>
            <button
              type="button"
              onClick={() => setIsGenerateOpen(false)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Key Name / Description</label>
            <Input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. AWS Lambda Ingestion Worker"
              className="h-8 text-xs bg-white/[0.04] border-white/10 text-white placeholder:text-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5">Select Scopes & Capabilities</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(
                [
                  { id: "read:analytics", label: "read:analytics (Read revenue & charts)" },
                  { id: "write:firewall", label: "write:firewall (Update risk rules & blocklist)" },
                  { id: "write:retries", label: "write:retries (Trigger smart payment dunning)" },
                  { id: "admin:billing", label: "admin:billing (Manage cards & plan tiers)" },
                  { id: "read:ledger", label: "read:ledger (Export financial settlements)" },
                ] as const
              ).map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-center gap-2 p-2 rounded-lg border border-white/[0.06] bg-white/[0.02] cursor-pointer hover:bg-white/[0.04]"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                    className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-gray-300">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsGenerateOpen(false)}
              className="h-7 text-xs border-white/10 bg-white/[0.02] text-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
              className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Create Secret Key"
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Keys List */}
      {isLoading ? (
        <div className="py-12 flex justify-center text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="rounded-xl border border-white/[0.08] bg-[#0d1226]/60 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-white/[0.14] transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs font-bold text-white tracking-wide">{key.name}</h3>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] text-emerald-400 font-medium">
                    Active
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <code className="rounded bg-black/40 px-2 py-0.5 text-xs font-mono text-gray-300 border border-white/5">
                    {key.keyMasked}
                  </code>
                  <button
                    onClick={() => handleCopy(key.keyMasked, key.id)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Copy Key Token"
                  >
                    {copiedKeyId === key.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {key.permissions.map((p) => (
                    <span
                      key={p}
                      className="rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 text-[10px] text-blue-300 font-mono"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="text-right text-[11px]">
                  <p>Last active: <span className="text-gray-300">{key.lastUsed}</span></p>
                  <p className="text-[10px] text-gray-500">
                    Created {new Date(key.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.info(`Rotated secret for key: ${key.name}`);
                    }}
                    className="h-7 text-xs border-white/10 bg-white/[0.02] text-gray-300 hover:text-white"
                  >
                    <RefreshCw className="h-3 w-3 mr-1 text-blue-400" />
                    Rotate
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevoke(key.id, key.name)}
                    className="h-7 text-xs border-rose-500/20 bg-rose-500/5 text-rose-300 hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
