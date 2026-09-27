import { apiRequest } from "./api";

export type GoalStatus =
  | "active"
  | "completed"
  | "cancelled";

export type GoalRecord = {
  id: number;
  title: string;
  target_amount: number | string;
  saved_amount: number | string;
  target_date: string | null;
  status: GoalStatus;
  created_at: string;
  updated_at: string;
};

type GoalListData = {
  goals: GoalRecord[];
};

export type GoalPayload = {
  title: string;
  target_amount: number;
  saved_amount: number;
  target_date: string | null;
  status?: GoalStatus | undefined;
};

export const goalService = {
  list() {
    return apiRequest<GoalListData>(
      "/goals/list.php",
    );
  },

  create(data: GoalPayload) {
    return apiRequest<{ id: number }>(
      "/goals/create.php",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  update(
    id: number,
    data: GoalPayload,
  ) {
    return apiRequest(
      "/goals/update.php",
      {
        method: "POST",
        body: JSON.stringify({
          id,
          status:
            data.status ?? "active",
          ...data,
        }),
      },
    );
  },

  remove(id: number) {
    return apiRequest(
      "/goals/delete.php",
      {
        method: "POST",
        body: JSON.stringify({ id }),
      },
    );
  },
};