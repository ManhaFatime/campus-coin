import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/campus/public-pages";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Smart Spending, Student Style | Campus Coin" },
    { name: "description", content: "A brighter way for students to track spending, set budgets, and grow healthy money habits." },
    { property: "og:title", content: "Smart Spending, Student Style | Campus Coin" },
    { property: "og:description", content: "A brighter way for students to track spending, set budgets, and grow healthy money habits." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HomePage/>,
});
