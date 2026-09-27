import { createFileRoute } from "@tanstack/react-router";

import { ProfilePage } from "@/components/campus/profile-page";
import { AppShell } from "@/components/campus/shared";
import { requireAdmin } from "@/lib/authGuard";

export const Route = createFileRoute("/admin/profile")({
  beforeLoad: async () => {
    await requireAdmin();
  },

  head: () => ({
    meta: [
      {
        title: "Admin Profile | Campus Coin",
      },
      {
        name: "description",
        content: "Manage the Campus Coin administrator profile and photo.",
      },
    ],
  }),

  component: () => (
    <AppShell admin>
      <ProfilePage admin />
    </AppShell>
  ),
});
