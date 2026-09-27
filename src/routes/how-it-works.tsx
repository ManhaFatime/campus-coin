import { createFileRoute } from "@tanstack/react-router";
import { HowPage } from "@/components/campus/public-pages";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({ meta: [
    { title: "How It Works | Campus Coin" },
    { name: "description", content: "Four simple steps to a more confident money journey with Campus Coin." },
    { property: "og:title", content: "How It Works | Campus Coin" },
    { property: "og:description", content: "Four simple steps to a more confident money journey with Campus Coin." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HowPage/>,
});
