import { apiRequest } from "./api";

export type TipRecord = {
  id: number;
  title: string;
  message: string;
  potential_saving: number | string | null;
  priority: "low" | "medium" | "high";
  is_pinned: number;
  is_dismissed: number;
  created_at: string;
};

export const tipService = {
  list() {
    return apiRequest<{
      tips: TipRecord[];
    }>("/tips/list.php");
  },

  generate() {
    return apiRequest<{
      created_ids: number[];
    }>("/tips/generate.php", {
      method: "POST",
    });
  },

  pin(id: number, pinned: boolean) {
    return apiRequest("/tips/pin.php", {
      method: "POST",
      body: JSON.stringify({
        id,
        pinned,
      }),
    });
  },

  dismiss(id: number) {
    return apiRequest("/tips/dismiss.php", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },
};