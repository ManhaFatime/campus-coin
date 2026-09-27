import { apiRequest } from "./api";

export type AdminUserRecord = {
    id: number;
    name: string;
    email: string;
    academic_year: string | null;
    monthly_allowance: number | string;
    monthly_savings_goal: number | string;
    is_active: number;
    created_at: string;
};

export type AdminContentRecord = {
    id: number;
    content_type:
    | "announcement"
    | "tip_template";
    title: string;
    message: string;
    is_active: number;
    created_at: string;
    updated_at: string;
};

export const adminService = {
    dashboard() {
        return apiRequest<{
            summary: {
                total_users: number;
                active_users: number;
                total_transactions: number;
                new_users_this_month: number;
            };

            user_growth: Array<{
                month: string;
                users: number | string;
            }>;

            most_used_categories: Array<{
                name: string;
                usage_count: number | string;
                total_amount: number | string;
            }>;
        }>("/admin/dashboard.php");
    },

    users(
        search = "",
        status = "",
    ) {
        const params =
            new URLSearchParams();

        if (search) {
            params.set(
                "search",
                search,
            );
        }

        if (status) {
            params.set(
                "status",
                status,
            );
        }

        return apiRequest<{
            users: AdminUserRecord[];
        }>(
            `/admin/users/list.php?${params.toString()}`,
        );
    },

    updateUserStatus(
        id: number,
        isActive: boolean,
    ) {

        return apiRequest(
            "/admin/users/status.php",
            {
                method: "POST",

                body: JSON.stringify({
                    id,
                    is_active:
                        isActive,
                }),
            },
        );
    },
    
    resetPassword(id: number) {
        return apiRequest<{
            temporary_password: string;
        }>("/admin/users/reset-password.php", {
            method: "POST",
            body: JSON.stringify({ id }),
        });
    },

    statistics() {
        return apiRequest<{
            monthly_activity: Array<{
                month: string;
                transactions:
                number | string;
                income:
                number | string | null;
                expense:
                number | string | null;
            }>;

            category_usage: Array<{
                name: string;
                type:
                | "income"
                | "expense";
                usage_count:
                number | string;
                total_amount:
                number | string;
            }>;
        }>("/admin/statistics.php");
    },

    content() {
        return apiRequest<{
            items:
            AdminContentRecord[];
        }>(
            "/admin/content/list.php",
        );
    },

    createContent(data: {
        content_type:
        | "announcement"
        | "tip_template";
        title: string;
        message: string;
    }) {
        return apiRequest(
            "/admin/content/create.php",
            {
                method: "POST",
                body: JSON.stringify(
                    data,
                ),
            },
        );
    },

    updateContent(
        id: number,
        data: {
            content_type:
            | "announcement"
            | "tip_template";
            title: string;
            message: string;
            is_active: boolean;
        },
    ) {
        return apiRequest(
            "/admin/content/update.php",
            {
                method: "POST",

                body: JSON.stringify({
                    id,
                    ...data,
                }),
            },
        );
    },

    deleteContent(
        id: number,
        contentType:
            | "announcement"
            | "tip_template",
    ) {
        return apiRequest(
            "/admin/content/delete.php",
            {
                method: "POST",

                body: JSON.stringify({
                    id,
                    content_type:
                        contentType,
                }),
            },
        );
    },
};