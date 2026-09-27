import { createFileRoute } from "@tanstack/react-router";
import { BookmarksPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({ meta: [
    { title: "Saved Items | Campus Coin" },
    { name: "description", content: "Find your bookmarked saving tips and money insights." },
    { property: "og:title", content: "Saved Items | Campus Coin" },
    { property: "og:description", content: "Find your bookmarked saving tips and money insights." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell><BookmarksPage/></AppShell>,
});
