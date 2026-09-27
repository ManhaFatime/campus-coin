import { apiRequest } from "./api";

export type InsightRecord = {
  id: number;
  insight_month: string;
  summary_text: string;
  advice_text: string | null;
  source: "system" | "ai";
  created_at: string;
};

export const insightService = {
  list() {
    return apiRequest<{
      insights: InsightRecord[];
    }>("/insights/list.php");
  },

  generate(month: string) {
    return apiRequest<InsightRecord>(
      "/insights/generate.php",
      {
        method: "POST",
        body: JSON.stringify({ month }),
      },
    );
  },
};