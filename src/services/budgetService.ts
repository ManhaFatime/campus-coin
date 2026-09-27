import { apiRequest } from "./api";

export type BudgetRecord = {
  id: number;
  category_id: number;
  category_name: string;
  budget_month: string;
  limit_amount: number;
  spent: number;
  remaining: number;
  percentage: number;
};

type BudgetListData = {
  month: string;
  budgets: BudgetRecord[];
};

export const budgetService = {
  list(month?: string) {
    const query = month
      ? `?month=${encodeURIComponent(month)}`
      : "";

    return apiRequest<BudgetListData>(
      `/budgets/list.php${query}`,
    );
  },

  save(data: {
    category_id: number;
    month: string;
    limit_amount: number;
  }) {
    return apiRequest(
      "/budgets/upsert.php",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  remove(id: number) {
    return apiRequest(
      "/budgets/delete.php",
      {
        method: "POST",
        body: JSON.stringify({ id }),
      },
    );
  },
};