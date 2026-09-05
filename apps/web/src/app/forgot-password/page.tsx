"use client";

import * as React from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/auth-service";
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid work email address");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success("Password reset instructions sent");
    } catch {
      toast.error("Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title={isSubmitted ? "Check your email" : "Reset your password"}
      subtitle={
        isSubmitted
          ? `We've dispatched a secure verification link to ${email}`
          : "Enter your registered email and we'll send you recovery instructions."
      }
      footer={
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to sign in</span>
        </Link>
      }
    >
      {isSubmitted ? (
        <div className="space-y-4 py-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-xs text-gray-300">
            Check your inbox and spam folder. The link expires in 15 minutes.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/reset-password">
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-xs h-9">
                Proceed to Reset Form
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              className="w-full border-white/10 bg-white/[0.03] text-gray-300 text-xs h-9"
            >
              Try another email
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="pl-9 bg-white/[0.04] border-white/10 text-white text-xs placeholder:text-gray-500 focus-visible:ring-blue-500"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs h-9 shadow-lg shadow-blue-600/30"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <span>Send Reset Link</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            )}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
