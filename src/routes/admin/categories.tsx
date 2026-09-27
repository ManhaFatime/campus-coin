import { createFileRoute } from "@tanstack/react-router";
import { CategoriesPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({ meta: [
    { title: "Global Categories | Campus Coin" },
    { name: "description", content: "Manage default income and expense categories." },
    { property: "og:title", content: "Global Categories | Campus Coin" },
    { property: "og:description", content: "Manage default income and expense categories." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell admin><CategoriesPage admin/></AppShell>,
});
