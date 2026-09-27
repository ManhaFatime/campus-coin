import { createFileRoute } from "@tanstack/react-router";
import { GoalsPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [
    { title: "Savings Goals | Campus Coin" },
    { name: "description", content: "Create and manage savings goals for your student life." },
    { property: "og:title", content: "Savings Goals | Campus Coin" },
    { property: "og:description", content: "Create and manage savings goals for your student life." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell><GoalsPage/></AppShell>,
});
