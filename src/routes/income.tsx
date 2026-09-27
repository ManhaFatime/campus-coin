import { createFileRoute } from "@tanstack/react-router";
import { TransactionsPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/income")({
  head: () => ({ meta: [
    { title: "Income | Campus Coin" },
    { name: "description", content: "Track and manage your student income." },
    { property: "og:title", content: "Income | Campus Coin" },
    { property: "og:description", content: "Track and manage your student income." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell><TransactionsPage income/></AppShell>,
});
