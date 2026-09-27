import { apiRequest } from "./api";

export type DashboardTransaction = {
  id: number;
  amount: number | string;
  type: "income" | "expense";
  description: string | null;
  transaction_date: string;
  category_name: string;
};

export type DashboardTip = {
  id: number;
  title: string;
  message: string;
  potential_saving: number | string | null;
  priority: "low" | "medium" | "high";
  is_pinned: number;
};

export type DashboardData = {
  month: string;
  income: number;
  expense: number;
  balance: number;

  top_category: {
    id: number;
    name: string;
    total: number | string;
  } | null;

  budget: {
    limit: number;
    spent: number;
    percentage: number;
  };

  recent_transactions: DashboardTransaction[];

  tips: DashboardTip[];

  unread_notifications: number;

  announcements: Array<{
    id: number;
    title: string;
    message: string;
    created_at: string;
  }>;
};

export const dashboardService = {
  getSummary() {
    return apiRequest<DashboardData>(
      "/dashboard/summary.php",
    );
  },
};