import { apiRequest } from "./api";

export type BookmarkItemType =
  | "tip"
  | "insight"
  | "announcement"
  | "tip_template";

export type BookmarkRecord = {
  id: number;
  item_type: BookmarkItemType;
  item_id: number;
  created_at: string;
  item: Record<string, unknown> | null;
};

export const bookmarkService = {
  list() {
    return apiRequest<{
      bookmarks: BookmarkRecord[];
    }>("/bookmarks/list.php");
  },

  toggle(
    itemType: BookmarkItemType,
    itemId: number,
  ) {
    return apiRequest<{
      bookmarked: boolean;
    }>("/bookmarks/toggle.php", {
      method: "POST",
      body: JSON.stringify({
        item_type: itemType,
        item_id: itemId,
      }),
    });
  },
};
