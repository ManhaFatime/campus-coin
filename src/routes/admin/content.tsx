import { createFileRoute } from "@tanstack/react-router";
import { AdminContentPage } from "@/components/campus/admin-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/admin/content")({
  head: () => ({ meta: [
    { title: "Content & Announcements | Campus Coin" },
    { name: "description", content: "Manage student announcements and saving tip templates." },
    { property: "og:title", content: "Content & Announcements | Campus Coin" },
    { property: "og:description", content: "Manage student announcements and saving tip templates." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell admin><AdminContentPage/></AppShell>,
});
