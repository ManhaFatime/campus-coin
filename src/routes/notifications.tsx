import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [
    { title: "Notifications | Campus Coin" },
    { name: "description", content: "Read budget alerts, tips and account updates." },
    { property: "og:title", content: "Notifications | Campus Coin" },
    { property: "og:description", content: "Read budget alerts, tips and account updates." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell><NotificationsPage/></AppShell>,
});
