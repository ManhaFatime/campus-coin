import { apiRequest } from "./api";

export type NotificationContentType =
  | "announcement"
  | "tip_template";

export type NotificationRecord = {
  id: number;
  title: string;
  message: string;
  type:
    | "budget"
    | "transaction"
    | "goal"
    | "recurring"
    | "insight"
    | "announcement"
    | "tip_template"
    | "system";
  source_type: NotificationContentType | null;
  source_id: number | null;
  is_bookmarked: number;
  is_read: number;
  created_at: string;
};

export const notificationService = {
  list(unreadOnly = false) {
    return apiRequest<{
      notifications: NotificationRecord[];
    }>(
      `/notifications/list.php${
        unreadOnly
          ? "?unread=1"
          : ""
      }`,
    );
  },

  markRead(id: number) {
    return apiRequest(
      "/notifications/mark-read.php",
      {
        method: "POST",
        body: JSON.stringify({ id }),
      },
    );
  },

  markAllRead() {
    return apiRequest(
      "/notifications/mark-all-read.php",
      {
        method: "POST",
      },
    );
  },
};
