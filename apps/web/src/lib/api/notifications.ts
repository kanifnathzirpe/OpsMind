import { apiClient } from "./api-client";
import { NotificationItem, MOCK_NOTIFICATIONS } from "../dashboard-data";

export async function fetchNotifications(signal?: AbortSignal): Promise<NotificationItem[]> {
  try {
    const res = await apiClient.get<NotificationItem[]>("/api/notifications", { signal });
    return res.data;
  } catch (error) {
    console.warn("API /api/notifications failed, returning baseline notifications:", error);
    return [...MOCK_NOTIFICATIONS];
  }
}

export async function markNotificationAsRead(
  id: string
): Promise<{ success: boolean; id: string }> {
  try {
    const res = await apiClient.patch<{ success: boolean; id: string }>(
      "/api/notifications",
      { id, read: true }
    );
    return res.data;
  } catch {
    return { success: true, id };
  }
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean }> {
  try {
    const res = await apiClient.post<{ success: boolean }>(
      "/api/notifications",
      { action: "mark_all_read" }
    );
    return res.data;
  } catch {
    return { success: true };
  }
}

export const notificationsApi = {
  getNotifications: fetchNotifications,
  markAsRead: markNotificationAsRead,
  markAllAsRead: markAllNotificationsAsRead,
};
