"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth-service";
import { ArrowRight, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [digits, setDigits] = React.useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(45);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (newDigits.every((d) => d !== "") && index === 5) {
      handleVerify(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const fullCode = code || digits.join("");
    if (fullCode.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.verifyEmail(fullCode);
      setIsSuccess(true);
      toast.success("Work email verified successfully");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1400);
    } catch {
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(45);
    toast.info("A fresh verification code has been dispatched to your work email.");
  };

  return (
    <AuthCard
      title={isSuccess ? "Email Verified" : "Verify Work Email"}
      subtitle={
        isSuccess
          ? "Your identity has been authenticated. Redirecting to OpsMind OS..."
          : "We sent a 6-digit verification code to your registered email address."
      }
      footer={
        <div className="flex items-center justify-between text-xs">
          <Link href="/login" className="text-gray-400 hover:text-white">
            Return to sign in
          </Link>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 font-medium"
          >
            {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
          </button>
        </div>
      }
    >
      {isSuccess ? (
        <div className="py-6 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-xs text-gray-300">Setting up your live telemetry feed...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="h-12 w-11 rounded-lg border border-white/10 bg-white/[0.04] text-center text-lg font-bold text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <Button
            type="button"
            onClick={() => handleVerify()}
            disabled={isLoading || digits.some((d) => d === "")}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs h-9 shadow-lg shadow-blue-600/30"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <span>Verify & Launch OS</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            )}
          </Button>

          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 flex items-center gap-2 text-[11px] text-gray-400">
            <ShieldAlert className="h-4 w-4 text-blue-400 shrink-0" />
            <span>Codes are single-use and automatically expire in 10 minutes.</span>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
