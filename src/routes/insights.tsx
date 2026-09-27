import { createFileRoute } from "@tanstack/react-router";
import { InsightPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [
    { title: "AI Insights | Campus Coin" },
    { name: "description", content: "Discover supportive personalized money insights." },
    { property: "og:title", content: "AI Insights | Campus Coin" },
    { property: "og:description", content: "Discover supportive personalized money insights." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell><InsightPage/></AppShell>,
});
