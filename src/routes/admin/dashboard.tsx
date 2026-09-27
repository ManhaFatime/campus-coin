import { createFileRoute } from "@tanstack/react-router";

import { AdminDashboardPage } from "@/components/campus/admin-pages";
import { AppShell } from "@/components/campus/shared";
import { requireAdmin } from "@/lib/authGuard";

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: async () => {
    await requireAdmin();
  },

  head: () => ({
    meta: [
      {
        title: "Admin Overview | Campus Coin",
      },
      {
        name: "description",
        content:
          "Monitor Campus Coin community activity and growth.",
      },
    ],
  }),

  component: () => (
    <AppShell admin>
      <AdminDashboardPage />
    </AppShell>
  ),
});