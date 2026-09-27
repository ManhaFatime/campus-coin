import { apiRequest } from "./api";

export type MonthlyReport = {
  month: string;

  summary: {
    income: number;
    expense: number;
    balance: number;
  };

  categories: Array<{
    category_id: number;
    name: string;
    type: "income" | "expense";
    total: number | string;
    transaction_count: number;
  }>;

  transactions: Array<{
    id: number;
    amount: number | string;
    type: "income" | "expense";
    description: string | null;
    transaction_date: string;
    category_name: string;
  }>;
};


export type CustomReport = {
  filters: {
    from: string;
    to: string;
    type: "income" | "expense" | null;
    category_id: number | null;
  };

  summary: {
    income: number;
    expense: number;
    balance: number;
  };

  categories: MonthlyReport["categories"];
  transactions: MonthlyReport["transactions"];
};

export type SixMonthReport = {
  months: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
};

export type DailyWeeklyReport = {
  month: string;

  daily: Array<{
    date: string;
    expense: number | string;
  }>;

  weekly: Array<{
    week_number: number;
    week_start: string;
    week_end: string;
    expense: number | string;
  }>;
};

function encodeMonth(month: string) {
  return encodeURIComponent(month);
}

export const reportService = {
  monthly(month: string) {
    return apiRequest<MonthlyReport>(
      `/reports/monthly.php?month=${encodeMonth(month)}`,
    );
  },

  sixMonths() {
    return apiRequest<SixMonthReport>(
      "/reports/six-months.php",
    );
  },

  custom(from: string, to: string) {
    const params = new URLSearchParams({
      from,
      to,
    });

    return apiRequest<CustomReport>(
      `/reports/custom.php?${params.toString()}`,
    );
  },

  dailyWeekly(month: string) {
    return apiRequest<DailyWeeklyReport>(
      `/reports/daily-weekly.php?month=${encodeMonth(month)}`,
    );
  },
};
