import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { NotificationSystemProvider } from "@/providers/notification-system-provider";
import { WebSocketProvider } from "@/providers/websocket-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpsMind - Autonomous Business OS",
  description: "AI-powered payment operations, fraud prevention, and revenue recovery platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <QueryProvider>
              <WebSocketProvider>
                <NotificationSystemProvider>
                  {children}
                  <Toaster richColors position="top-right" theme="dark" closeButton />
                </NotificationSystemProvider>
              </WebSocketProvider>
            </QueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
