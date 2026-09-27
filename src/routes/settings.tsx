import { createFileRoute } from "@tanstack/react-router";

import { SettingsOnlyPage } from "@/components/campus/profile-page";
import { AppShell } from "@/components/campus/shared";
import { requireStudent } from "@/lib/authGuard";

export const Route = createFileRoute("/settings")({
  beforeLoad: async () => {
    await requireStudent();
  },

  head: () => ({
    meta: [
      {
        title: "Settings | Campus Coin",
      },
      {
        name: "description",
        content: "Choose appearance, accessibility, and security preferences.",
      },
    ],
  }),

  component: () => (
    <AppShell>
      <SettingsOnlyPage />
    </AppShell>
  ),
});
