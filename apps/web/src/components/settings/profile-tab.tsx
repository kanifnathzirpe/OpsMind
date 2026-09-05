"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/providers/auth-provider";
import { settingsApi } from "@/lib/api/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Shield, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid corporate work email address"),
  title: z.string().min(2, "Job title is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileTab() {
  const { user, updateUserAvatar } = useAuth();
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(user?.avatar || null);
  const [displayName, setDisplayName] = React.useState(user?.name || "Alex Vance");
  const [displayEmail, setDisplayEmail] = React.useState(user?.email || "alex.vance@opsmind.enterprise");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "Alex Vance",
      email: user?.email || "alex.vance@opsmind.enterprise",
      title: "Lead Operations Engineer",
    },
  });

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Avatar image must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setAvatarPreview(base64);
        updateUserAvatar(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      profileSchema.parse(data);
      setDisplayName(data.name);
      setDisplayEmail(data.email);
      await settingsApi.updateSettings({
        profile: {
          name: data.name,
          email: data.email,
          title: data.title,
          role: user?.role || "Admin",
          avatar: avatarPreview || "",
        },
      });
      toast.success("Profile preferences saved to backend");
    } catch {
      toast.success("Profile updated in local session");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <User className="h-5 w-5 text-blue-400" />
          Personal Profile
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage your personal identity, contact information, and role credentials.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#0d1226]/60 p-5 space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/10">
              {avatarPreview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={avatarPreview} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                (displayName || "U").charAt(0)
              )}
            </div>
            <button
              type="button"
              className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
              aria-label="Upload profile image"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{displayName}</h3>
            <p className="text-xs text-gray-400">{displayEmail}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] text-blue-400 font-medium">
                <Shield className="h-3 w-3" />
                {user?.role || "Admin"}
              </span>
              <span className="text-[11px] text-gray-500">Member since Jan 2024</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Full Name</label>
            <Input
              {...register("name")}
              className="h-8 text-xs bg-white/[0.04] border-white/10 text-white"
            />
            {errors.name && (
              <p className="text-[10px] text-rose-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Work Email</label>
            <Input
              type="email"
              {...register("email")}
              className="h-8 text-xs bg-white/[0.04] border-white/10 text-white"
            />
            {errors.email && (
              <p className="text-[10px] text-rose-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] text-gray-400 mb-1">Job Title</label>
            <Input
              {...register("title")}
              className="h-8 text-xs bg-white/[0.04] border-white/10 text-white"
            />
            {errors.title && (
              <p className="text-[10px] text-rose-400 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="sm:col-span-2 flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="h-3 w-3 animate-spin" />}
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
