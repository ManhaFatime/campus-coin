import { apiRequest } from "./api";

export type TransactionType =
  | "income"
  | "expense";

export type TransactionRecord = {
  id: number;
  category_id: number;
  category_name: string;
  amount: number | string;
  type: TransactionType;
  description: string | null;
  transaction_date: string;
  is_recurring: number;
  recurring_frequency:
    | "weekly"
    | "monthly"
    | "yearly"
    | null;
  recurring_end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type TransactionPagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

type TransactionListData = {
  transactions: TransactionRecord[];
  pagination: TransactionPagination;
};

export type TransactionPayload = {
  category_id: number;
  amount: number;
  type: TransactionType;
  description: string;
  transaction_date: string;
  is_recurring: boolean;

  recurring_frequency?:
    | "weekly"
    | "monthly"
    | "yearly"
    | undefined;

  recurring_end_date?:
    | string
    | null
    | undefined;
};

export const transactionService = {
  list(params: {
  type?: TransactionType | undefined;
  category_id?: number | undefined;
  from?: string | undefined;
  to?: string | undefined;
  search?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
} = {}) {
    const query =
      new URLSearchParams();

    if (params.type) {
      query.set(
        "type",
        params.type,
      );
    }

    if (params.category_id) {
      query.set(
        "category_id",
        String(
          params.category_id,
        ),
      );
    }

    if (params.from) {
      query.set(
        "from",
        params.from,
      );
    }

    if (params.to) {
      query.set(
        "to",
        params.to,
      );
    }

    if (params.search) {
      query.set(
        "search",
        params.search,
      );
    }

    query.set(
      "page",
      String(params.page ?? 1),
    );

    query.set(
      "limit",
      String(params.limit ?? 25),
    );

    return apiRequest<TransactionListData>(
      `/transactions/list.php?${query.toString()}`,
    );
  },

  create(
    data: TransactionPayload,
  ) {
    return apiRequest<{
      transaction: {
        id: number;
      };
    }>(
      "/transactions/create.php",
      {
        method: "POST",
        body: JSON.stringify(
          data,
        ),
      },
    );
  },

  update(
    id: number,
    data: TransactionPayload,
  ) {
    return apiRequest(
      "/transactions/update.php",
      {
        method: "POST",
        body: JSON.stringify({
          id,
          ...data,
        }),
      },
    );
  },

  remove(id: number) {
    return apiRequest(
      "/transactions/delete.php",
      {
        method: "POST",
        body: JSON.stringify({
          id,
        }),
      },
    );
  },
};