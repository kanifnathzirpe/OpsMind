"use client";

import * as React from "react";
import { useTeamQuery, useInviteMemberMutation, useRemoveMemberMutation } from "@/hooks/queries/use-dashboard-queries";
import { UserRole } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
} from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { toast } from "sonner";

export function TeamTab() {
  const { data: members = [], isLoading } = useTeamQuery();
  const inviteMutation = useInviteMemberMutation();
  const removeMutation = useRemoveMemberMutation();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [inviteName, setInviteName] = React.useState("");
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<UserRole>("Developer");

  const filteredMembers = React.useMemo(() => {
    if (!searchQuery.trim()) return members;
    const q = searchQuery.toLowerCase().trim();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
    );
  }, [members, searchQuery]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes("@")) {
      toast.error("Please provide a valid work email");
      return;
    }

    await inviteMutation.mutateAsync({
      name: inviteName || inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
    });

    setInviteName("");
    setInviteEmail("");
    setIsInviteOpen(false);
  };

  const handleRemove = (id: string, name: string) => {
    if (confirm(`Revoke access for ${name}?`)) {
      removeMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            Team Members & Access
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage teammates, granular RBAC permissions, and multi-factor enforcement.
          </p>
        </div>

        <Button
          onClick={() => setIsInviteOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 shadow-md shadow-blue-900/30"
        >
          <UserPlus className="h-3.5 w-3.5 mr-1.5" />
          Invite Member
        </Button>
      </div>

      {/* Invite Modal / Box */}
      {isInviteOpen && (
        <form
          onSubmit={handleInvite}
          className="rounded-xl border border-blue-500/30 bg-blue-500/[0.04] p-4 space-y-3 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-blue-400" />
              Invite New Teammate
            </h3>
            <button
              type="button"
              onClick={() => setIsInviteOpen(false)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Full Name</label>
              <Input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className="h-8 text-xs bg-white/[0.04] border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Work Email</label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="jordan@company.com"
                className="h-8 text-xs bg-white/[0.04] border-white/10 text-white placeholder:text-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Role Permission</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                className="w-full h-8 rounded-md border border-white/10 bg-[#0d1226] px-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Admin">Admin (Full Access & Billing)</option>
                <option value="Developer">Developer (API, Webhooks, Retries)</option>
                <option value="Finance">Finance (Settlement, Ledgers, Invoices)</option>
                <option value="Support">Support (Customer Lookups & Refunds)</option>
                <option value="Viewer">Viewer (Read-Only Dashboards)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsInviteOpen(false)}
              className="h-7 text-xs border-white/10 bg-white/[0.02] text-gray-400"
            >
              Dismiss
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={inviteMutation.isPending}
              className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white"
            >
              {inviteMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Dispatch Invite"
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-500" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter team by name, email, or role..."
          className="h-8 pl-8 text-xs bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
        />
      </div>

      {/* Team Table */}
      {isLoading ? (
        <div className="py-12 flex justify-center text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
        </div>
      ) : filteredMembers.length === 0 ? (
        <EmptyState
          type="customers"
          title="No Team Members Found"
          description="No teammates match your search criteria. Try a different query or invite a colleague."
          actionText="Clear Search"
          onAction={() => setSearchQuery("")}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0d1226]/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs shrink-0 ring-1 ring-white/10">
                        {member.avatar ? (
                          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${member.avatar})` }} />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-[11px] text-gray-400">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium ${
                        member.role === "Admin"
                          ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                          : member.role === "Developer"
                          ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                          : member.role === "Finance"
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                          : "bg-white/5 text-gray-300 border border-white/10"
                      }`}
                    >
                      <Shield className="h-3 w-3" />
                      {member.role}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        member.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : member.status === "Pending"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {member.status === "Active" && (
                        <CheckCircle2 className="h-2.5 w-2.5" />
                      )}
                      {member.status === "Pending" && <Clock className="h-2.5 w-2.5" />}
                      {member.status === "Suspended" && (
                        <AlertCircle className="h-2.5 w-2.5" />
                      )}
                      {member.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-gray-400 text-[11px]">
                    {member.lastActive}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {member.role !== "Admin" ? (
                      <button
                        onClick={() => handleRemove(member.id, member.name)}
                        disabled={removeMutation.isPending}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-500 hover:text-rose-400 rounded hover:bg-rose-500/10"
                        title="Revoke access"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-600 font-mono">Owner</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
