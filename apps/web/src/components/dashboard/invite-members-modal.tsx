"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Mail,
  Shield,
  X,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface InviteMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMembersModal({ isOpen, onClose }: InviteMembersModalProps) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<"Admin" | "Analyst" | "Developer" | "Viewer">("Analyst");
  const [isSending, setIsSending] = React.useState(false);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Invitation sent to ${email}`, {
        description: `Granted role: ${role} with zero-trust API access`,
      });
      setEmail("");
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Invite Team Members"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c102b] p-6 shadow-2xl shadow-black/80"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Invite Operations Team
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Grant scoped merchant access to engineers and analysts.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 my-5">
              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    required
                    className="pl-9 bg-black/30 border-white/10 text-xs text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1.5">
                  Access Level & Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Admin", desc: "Full ledger & firewall rules" },
                    { name: "Analyst", desc: "Read telemetry & trigger retries" },
                    { name: "Developer", desc: "API keys & webhook sandbox" },
                    { name: "Viewer", desc: "Read-only analytics & reporting" },
                  ].map((r) => (
                    <div
                      key={r.name}
                      onClick={() => setRole(r.name as "Admin" | "Analyst" | "Developer" | "Viewer")}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        role === r.name
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{r.name}</span>
                        {role === r.name && <Check className="h-3 w-3 text-blue-400" />}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Shield className="h-3 w-3 text-emerald-400" /> SSO / SAML Enforced
                </span>
                <Button
                  type="submit"
                  disabled={isSending}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
                >
                  <Sparkles className="h-3 w-3 mr-1.5" />
                  {isSending ? "Dispatching..." : "Send Invite"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
