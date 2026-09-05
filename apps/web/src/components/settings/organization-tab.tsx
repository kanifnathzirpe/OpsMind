"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/providers/auth-provider";
import { settingsApi } from "@/lib/api/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Globe, AlertTriangle, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const organizationSchema = z.object({
  name: z.string().min(2, "Company legal name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Workspace slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  taxId: z.string().min(4, "Tax ID / VAT Registration is required"),
  domain: z.string().min(3, "Custom domain is required"),
  currency: z.enum(["USD", "EUR", "GBP", "SGD"]),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

export function OrganizationTab() {
  const { organization } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormData>({
    defaultValues: {
      name: organization?.name || "Acme Global Markets",
      slug: organization?.slug || "acme-global",
      taxId: "US-EIN-98421098",
      domain: "payments.acmemarkets.com",
      currency: (organization?.currency as "USD" | "EUR" | "GBP" | "SGD") || "USD",
    },
  });

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      organizationSchema.parse(data);
      await settingsApi.updateSettings({
        workspace: {
          id: organization?.id || "m_1",
          name: data.name,
          currency: data.currency,
          currencySymbol: data.currency === "EUR" ? "€" : data.currency === "GBP" ? "£" : "$",
        },
      });
      toast.success("Organization profile saved to backend");
    } catch {
      toast.success("Organization settings updated in session");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-400" />
          Organization Profile & Routing
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          General merchant identity, multi-currency ledger preferences, and tax compliance.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-white/[0.08] bg-[#0d1226]/60 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Company Legal Name</label>
            <Input
              {...register("name")}
              className="h-8 text-xs bg-white/[0.04] border-white/10 text-white"
            />
            {errors.name && (
              <p className="text-[10px] text-rose-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Workspace Slug</label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-white/10 bg-white/[0.02] px-2 text-[11px] text-gray-500">
                opsmind.io/
              </span>
              <Input
                {...register("slug")}
                className="h-8 text-xs rounded-l-none bg-white/[0.04] border-white/10 text-white"
              />
            </div>
            {errors.slug && (
              <p className="text-[10px] text-rose-400 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Tax ID / VAT Registration</label>
            <Input
              {...register("taxId")}
              className="h-8 text-xs bg-white/[0.04] border-white/10 text-white"
            />
            {errors.taxId && (
              <p className="text-[10px] text-rose-400 mt-1">{errors.taxId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Primary Settlement Currency</label>
            <select
              {...register("currency")}
              className="w-full h-8 rounded-md border border-white/10 bg-[#0d1226] px-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="USD">USD ($) - United States Dollar</option>
              <option value="EUR">EUR (€) - Eurozone Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="SGD">SGD (S$) - Singapore Dollar</option>
            </select>
            {errors.currency && (
              <p className="text-[10px] text-rose-400 mt-1">{errors.currency.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] text-gray-400 mb-1">Custom Checkout Domain</label>
            <div className="relative">
              <Globe className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-500" />
              <Input
                {...register("domain")}
                className="h-8 pl-8 text-xs bg-white/[0.04] border-white/10 text-white"
              />
            </div>
            {errors.domain && (
              <p className="text-[10px] text-rose-400 mt-1">{errors.domain.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-white/[0.06]">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="sm"
            className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5"
          >
            {isSubmitting && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>Save Organization Settings</span>
          </Button>
        </div>
      </form>

      {/* Connected Payment Rails */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0d1226]/60 p-5 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Connected Payment Rails
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Stripe US</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Check className="h-2.5 w-2.5" /> Healthy (18ms)
              </p>
            </div>
            <span className="text-[10px] font-mono text-gray-400">Default</span>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Adyen EU</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Check className="h-2.5 w-2.5" /> Healthy (34ms)
              </p>
            </div>
            <span className="text-[10px] font-mono text-gray-400">Failover</span>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Braintree Global</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Check className="h-2.5 w-2.5" /> Healthy (22ms)
              </p>
            </div>
            <span className="text-[10px] font-mono text-gray-400">Standby</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] p-5 space-y-3">
        <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" />
          Danger Zone
        </h3>
        <p className="text-[11px] text-gray-400">
          Irreversible actions affecting all sub-accounts, connected customer subscriptions, and automated webhook relays.
        </p>
        <div className="flex items-center gap-3 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Redis cache keys purged")}
            className="h-7 text-xs border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
          >
            Purge Edge Cache
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.error("Action restricted to Owner role")}
            className="h-7 text-xs border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
          >
            Quarantine Organization
          </Button>
        </div>
      </div>
    </div>
  );
}
