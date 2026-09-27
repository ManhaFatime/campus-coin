import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Reports | Campus Coin" },
    { name: "description", content: "Explore income, expenses and spending patterns with Campus Coin reports." },
    { property: "og:title", content: "Reports | Campus Coin" },
    { property: "og:description", content: "Explore income, expenses and spending patterns with Campus Coin reports." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell><ReportsPage/></AppShell>,
});
