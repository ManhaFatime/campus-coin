import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      {
        title: "Admin Settings | Campus Coin",
      },
      {
        name: "description",
        content: "Adjust Campus Coin admin workspace preferences.",
      },
      {
        property: "og:title",
        content: "Admin Settings | Campus Coin",
      },
      {
        property: "og:description",
        content: "Adjust Campus Coin admin workspace preferences.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),

  component: () => (
    <AppShell admin>
      <SettingsPage admin />
    </AppShell>
  ),
});
