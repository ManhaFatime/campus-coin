import { createFileRoute } from "@tanstack/react-router";

import { CampusAiPage } from "@/components/campus/campus-ai";
import { AppShell } from "@/components/campus/shared";
import { requireStudent } from "@/lib/authGuard";

export const Route = createFileRoute("/assistant")({
  beforeLoad: async () => {
    await requireStudent();
  },

  head: () => ({
    meta: [
      {
        title: "Campus AI | Campus Coin",
      },
      {
        name: "description",
        content:
          "Chat with Campus AI in English, Urdu, or Roman Urdu using text or voice.",
      },
    ],
  }),

  component: () => (
    <AppShell>
      <CampusAiPage />
    </AppShell>
  ),
});
