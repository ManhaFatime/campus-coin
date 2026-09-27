import { createFileRoute } from "@tanstack/react-router";

import { ProfilePage } from "@/components/campus/profile-page";
import { AppShell } from "@/components/campus/shared";
import { requireStudent } from "@/lib/authGuard";

export const Route = createFileRoute("/profile")({
  beforeLoad: async () => {
    await requireStudent();
  },

  head: () => ({
    meta: [
      {
        title: "My Profile | Campus Coin",
      },
      {
        name: "description",
        content: "Manage your Campus Coin student profile and photo.",
      },
    ],
  }),

  component: () => (
    <AppShell>
      <ProfilePage />
    </AppShell>
  ),
});
