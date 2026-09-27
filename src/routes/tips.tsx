import { createFileRoute } from "@tanstack/react-router";
import { InsightPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/tips")({
  head: () => ({ meta: [
    { title: "Saving Tips | Campus Coin" },
    { name: "description", content: "Find small, practical ways to save money at university." },
    { property: "og:title", content: "Saving Tips | Campus Coin" },
    { property: "og:description", content: "Find small, practical ways to save money at university." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell><InsightPage tips/></AppShell>,
});
