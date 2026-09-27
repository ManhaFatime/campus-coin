import { createFileRoute } from "@tanstack/react-router";
import { AdminStatisticsPage } from "@/components/campus/admin-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/admin/statistics")({
  head: () => ({
    meta: [
      {
        title: "Admin Statistics | Campus Coin",
      },
      {
        name: "description",
        content: "Review Campus Coin reporting and trends.",
      },
      {
        property: "og:title",
        content: "Admin Statistics | Campus Coin",
      },
      {
        property: "og:description",
        content: "Review Campus Coin reporting and trends.",
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
      <AdminStatisticsPage />
    </AppShell>
  ),
});
