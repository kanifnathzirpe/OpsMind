"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "warning" | "error" | "info";

export interface QueuedNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationSystemContextType {
  notifications: QueuedNotification[];
  notify: {
    success: (title: string, message?: string, options?: Partial<QueuedNotification>) => string;
    warning: (title: string, message?: string, options?: Partial<QueuedNotification>) => string;
    error: (title: string, message?: string, options?: Partial<QueuedNotification>) => string;
    info: (title: string, message?: string, options?: Partial<QueuedNotification>) => string;
  };
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const NotificationSystemContext = React.createContext<
  NotificationSystemContextType | undefined
>(undefined);

const ICONS: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertOctagon,
  info: Info,
};

const STYLES: Record<
  NotificationType,
  {
    border: string;
    bg: string;
    iconColor: string;
    glow: string;
  }
> = {
  success: {
    border: "border-emerald-500/30",
    bg: "bg-[#061c16]/95",
    iconColor: "text-emerald-400",
    glow: "shadow-emerald-950/40",
  },
  warning: {
    border: "border-amber-500/30",
    bg: "bg-[#1c1406]/95",
    iconColor: "text-amber-400",
    glow: "shadow-amber-950/40",
  },
  error: {
    border: "border-rose-500/30",
    bg: "bg-[#1c080b]/95",
    iconColor: "text-rose-400",
    glow: "shadow-rose-950/40",
  },
  info: {
    border: "border-blue-500/30",
    bg: "bg-[#071329]/95",
    iconColor: "text-blue-400",
    glow: "shadow-blue-950/40",
  },
};

export function NotificationSystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = React.useState<QueuedNotification[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = React.useCallback(
    (
      type: NotificationType,
      title: string,
      message?: string,
      options?: Partial<QueuedNotification>
    ): string => {
      const id = options?.id || `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const duration = options?.duration ?? 4500;

      const item: QueuedNotification = {
        id,
        type,
        title,
        message,
        duration,
        action: options?.action,
      };

      setNotifications((prev) => [item, ...prev].slice(0, 5)); // Keep max 5 queued

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }

      return id;
    },
    [dismiss]
  );

  const notify = React.useMemo(
    () => ({
      success: (title: string, message?: string, options?: Partial<QueuedNotification>) =>
        addNotification("success", title, message, options),
      warning: (title: string, message?: string, options?: Partial<QueuedNotification>) =>
        addNotification("warning", title, message, options),
      error: (title: string, message?: string, options?: Partial<QueuedNotification>) =>
        addNotification("error", title, message, options),
      info: (title: string, message?: string, options?: Partial<QueuedNotification>) =>
        addNotification("info", title, message, options),
    }),
    [addNotification]
  );

  return (
    <NotificationSystemContext.Provider
      value={{ notifications, notify, dismiss, clearAll }}
    >
      {children}

      {/* Floating Notification Queue Stack */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        <AnimatePresence>
          {notifications.map((item) => {
            const Icon = ICONS[item.type];
            const style = STYLES[item.type];

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={cn(
                  "pointer-events-auto rounded-xl border backdrop-blur-xl p-3.5 shadow-2xl flex items-start gap-3 select-none",
                  style.border,
                  style.bg,
                  style.glow
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className={cn("h-4 w-4", style.iconColor)} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white leading-tight">
                    {item.title}
                  </h4>
                  {item.message && (
                    <p className="text-[11px] text-gray-300 mt-1 leading-snug break-words">
                      {item.message}
                    </p>
                  )}
                  {item.action && (
                    <button
                      onClick={() => {
                        item.action?.onClick();
                        dismiss(item.id);
                      }}
                      className="mt-2 text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2"
                    >
                      {item.action.label}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => dismiss(item.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-white rounded-md p-1 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NotificationSystemContext.Provider>
  );
}

export function useNotificationSystem(): NotificationSystemContextType {
  const context = React.useContext(NotificationSystemContext);
  if (!context) {
    throw new Error(
      "useNotificationSystem must be used within a NotificationSystemProvider"
    );
  }
  return context;
}
