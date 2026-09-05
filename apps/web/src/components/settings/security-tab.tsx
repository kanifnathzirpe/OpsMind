"use client";

import * as React from "react";
import { useSessionsQuery } from "@/hooks/queries/use-dashboard-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Laptop,
  Smartphone,
  KeyRound,
  Lock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { z } from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export function SecurityTab() {
  const { data: sessions = [], isLoading, refetch } = useSessionsQuery();
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    passwordSchema.parse(data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    reset();
    toast.success("Security credentials updated and re-encrypted");
  };

  const handleTerminateSession = (id: string) => {
    toast.info(`Session ${id.substring(0, 8)} invalidated`);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-400" />
          Security & Access Controls
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Two-factor authentication, active browser sessions, and credential management.
        </p>
      </div>

      {/* 2FA Card */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d1226]/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</h3>
              <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] text-emerald-400 font-medium">
                Enforced
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Protect your organization with TOTP authenticator (Google Authenticator, 1Password, YubiKey).
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setTwoFactorEnabled(!twoFactorEnabled);
            toast.info(twoFactorEnabled ? "2FA policy relaxed" : "2FA policy enforced");
          }}
          className="h-8 text-xs border-white/10 bg-white/[0.03] text-gray-300 hover:text-white"
        >
          {twoFactorEnabled ? "Reconfigure 2FA" : "Enable 2FA"}
        </Button>
      </div>

      {/* Active Sessions */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Active Browser Sessions
        </h3>
        {isLoading ? (
          <div className="py-6 flex justify-center text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-xl border border-white/[0.06] bg-[#0d1226]/50 p-3.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-gray-400">
                    {session.device.includes("iPhone") ? (
                      <Smartphone className="h-4 w-4" />
                    ) : (
                      <Laptop className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{session.device}</span>
                      {session.current && (
                        <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 text-[9px] text-blue-400 font-medium">
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {session.browser} • {session.ip}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-500 hidden sm:inline">
                    {session.lastActive}
                  </span>
                  {!session.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                      className="h-7 text-[11px] border-rose-500/20 text-rose-300 hover:bg-rose-500/10"
                    >
                      Terminate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Password Update Form */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d1226]/60 p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-blue-400" />
          Update Master Password
        </h3>

        <form onSubmit={handleSubmit(onPasswordSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Current Password</label>
            <Input
              type="password"
              {...register("currentPassword")}
              placeholder="••••••••••••"
              className="h-8 text-xs bg-white/[0.04] border-white/10 text-white placeholder:text-gray-500"
            />
            {errors.currentPassword && (
              <p className="text-[10px] text-rose-400 mt-1">{errors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">New Strong Password</label>
            <Input
              type="password"
              {...register("newPassword")}
              placeholder="••••••••••••"
              className="h-8 text-xs bg-white/[0.04] border-white/10 text-white placeholder:text-gray-500"
            />
            {errors.newPassword && (
              <p className="text-[10px] text-rose-400 mt-1">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Save New Password"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
