import { createFileRoute } from "@tanstack/react-router";
import { CategoriesPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [
    { title: "Categories | Campus Coin" },
    { name: "description", content: "Organize personal income and expense categories." },
    { property: "og:title", content: "Categories | Campus Coin" },
    { property: "og:description", content: "Organize personal income and expense categories." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell><CategoriesPage/></AppShell>,
});
