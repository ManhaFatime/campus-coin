import { apiRequest } from "./api";

export type CategoryType =
  | "income"
  | "expense";

export type CategoryRecord = {
  id: number;
  user_id?: number | null;
  name: string;
  type: CategoryType;
  is_default: number;
  is_active: number;
  created_at?: string;
};

type CategoryListData = {
  categories: CategoryRecord[];
};

export const categoryService = {
  // -------------------------------------------------------
  // Student categories
  // -------------------------------------------------------

  list(type?: CategoryType) {
    const query = type
      ? `?type=${type}`
      : "";

    return apiRequest<CategoryListData>(
      `/categories/list.php${query}`,
    );
  },

  create(data: {
    name: string;
    type: CategoryType;
  }) {
    return apiRequest<{
      id: number;
    }>(
      "/categories/create.php",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  update(
    id: number,
    data: {
      name: string;
      type: CategoryType;
    },
  ) {
    return apiRequest(
      "/categories/update.php",
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
      "/categories/delete.php",
      {
        method: "POST",
        body: JSON.stringify({
          id,
        }),
      },
    );
  },

  // -------------------------------------------------------
  // Administrator default categories
  // -------------------------------------------------------

  adminList() {
    return apiRequest<CategoryListData>(
      "/admin/categories/list.php",
    );
  },

  adminCreate(data: {
    name: string;
    type: CategoryType;
  }) {
    return apiRequest<{
      id: number;
    }>(
      "/admin/categories/create.php",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  adminUpdate(
    id: number,
    data: {
      name: string;
      type: CategoryType;
      is_active?: boolean;
    },
  ) {
    return apiRequest(
      "/admin/categories/update.php",
      {
        method: "POST",
        body: JSON.stringify({
          id,
          ...data,
        }),
      },
    );
  },

  adminRemove(id: number) {
    return apiRequest(
      "/admin/categories/delete.php",
      {
        method: "POST",
        body: JSON.stringify({
          id,
        }),
      },
    );
  },
};