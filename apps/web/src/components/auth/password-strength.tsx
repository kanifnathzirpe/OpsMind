"use client";

import * as React from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const requirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains a number", valid: /\d/.test(password) },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Special symbol (!@#$%^&*)", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = requirements.filter((r) => r.valid).length;

  const strength =
    score === 0
      ? { label: "Too weak", color: "bg-gray-700", text: "text-gray-400" }
      : score <= 2
      ? { label: "Fair", color: "bg-amber-500", text: "text-amber-400" }
      : score === 3
      ? { label: "Good", color: "bg-blue-500", text: "text-blue-400" }
      : { label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2 pt-1 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-[11px]">Password Strength:</span>
        <span className={`text-[11px] font-semibold ${strength.text}`}>
          {strength.label}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`rounded-full h-full transition-colors duration-200 ${
              score >= step ? strength.color : "bg-white/[0.08]"
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-1 pt-1">
        {requirements.map((req, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px]">
            {req.valid ? (
              <Check className="h-3 w-3 text-emerald-400 shrink-0" />
            ) : (
              <X className="h-3 w-3 text-gray-500 shrink-0" />
            )}
            <span className={req.valid ? "text-gray-300" : "text-gray-500"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
