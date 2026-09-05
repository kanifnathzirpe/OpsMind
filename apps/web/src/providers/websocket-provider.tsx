"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  wsClient,
  WebSocketStatus,
  MessageHandler,
} from "@/lib/websocket/websocket-client";
import { QUERY_KEYS } from "@/hooks/queries/use-dashboard-queries";

export interface WebSocketContextType {
  status: WebSocketStatus;
  isConnected: boolean;
  subscribe: <T = unknown>(topic: string, handler: MessageHandler<T>) => () => void;
  publish: <T = unknown>(topic: string, payload: T) => void;
}

const WebSocketContext = React.createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<WebSocketStatus>(wsClient.getStatus());
  const queryClient = useQueryClient();

  React.useEffect(() => {
    // Subscribe to status changes
    const unsubStatus = wsClient.onStatusChange((newStatus) => {
      setStatus(newStatus);
    });

    // Connect WebSocket
    wsClient.connect();

    // Hook real-time channels directly into TanStack Query Cache!
    const unsubMetrics = wsClient.subscribe("dashboard:metrics", () => {
      // Invalidate dashboard metrics in background without flash
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    });

    const unsubFraud = wsClient.subscribe("fraud:alerts", () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fraud() });
    });

    const unsubPayments = wsClient.subscribe("payments:status", () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payments() });
    });

    const unsubRevenue = wsClient.subscribe("revenue:stream", () => {
      queryClient.invalidateQueries({ queryKey: ["revenueSeries"] });
    });

    return () => {
      unsubMetrics();
      unsubFraud();
      unsubPayments();
      unsubRevenue();
      unsubStatus();
    };
  }, [queryClient]);

  const subscribe = React.useCallback(
    <T = unknown>(topic: string, handler: MessageHandler<T>) => {
      return wsClient.subscribe<T>(topic, handler);
    },
    []
  );

  const publish = React.useCallback(<T = unknown>(topic: string, payload: T) => {
    wsClient.publish<T>(topic, payload);
  }, []);

  const value = React.useMemo(
    () => ({
      status,
      isConnected: status === "connected",
      subscribe,
      publish,
    }),
    [status, subscribe, publish]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket(): WebSocketContextType {
  const context = React.useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
