import { createFileRoute } from "@tanstack/react-router";
import { TransactionsPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/transactions")({
  head: () => ({ meta: [
    { title: "Expenses | Campus Coin" },
    { name: "description", content: "Track and manage your student expenses." },
    { property: "og:title", content: "Expenses | Campus Coin" },
    { property: "og:description", content: "Track and manage your student expenses." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell><TransactionsPage/></AppShell>,
});
