import { createFileRoute } from "@tanstack/react-router";
import { FeaturesPage } from "@/components/campus/public-pages";

export const Route = createFileRoute("/features")({
  head: () => ({ meta: [
    { title: "Features for Student Life | Campus Coin" },
    { name: "description", content: "Explore expense tracking, budgets, goals, insights and reports made for student life." },
    { property: "og:title", content: "Features for Student Life | Campus Coin" },
    { property: "og:description", content: "Explore expense tracking, budgets, goals, insights and reports made for student life." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <FeaturesPage/>,
});
