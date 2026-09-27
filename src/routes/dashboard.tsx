import { createFileRoute } from "@tanstack/react-router";

import { DashboardPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";
import { requireStudent } from "@/lib/authGuard";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    await requireStudent();
  },

  head: () => ({
    meta: [
      {
        title: "Student Dashboard | Campus Coin",
      },
      {
        name: "description",
        content:
          "Your student balance, spending, goals and recent transactions in one place.",
      },
    ],
  }),

  component: () => (
    <AppShell>
      <DashboardPage />
    </AppShell>
  ),
});