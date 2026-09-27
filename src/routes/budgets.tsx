import { createFileRoute } from "@tanstack/react-router";
import { BudgetsPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/budgets")({
  head: () => ({ meta: [
    { title: "Budgets | Campus Coin" },
    { name: "description", content: "Set monthly spending limits and monitor your budget progress." },
    { property: "og:title", content: "Budgets | Campus Coin" },
    { property: "og:description", content: "Set monthly spending limits and monitor your budget progress." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell><BudgetsPage/></AppShell>,
});
