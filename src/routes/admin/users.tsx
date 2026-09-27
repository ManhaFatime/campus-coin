import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "@/components/campus/admin-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [
    { title: "User Management | Campus Coin" },
    { name: "description", content: "Review and manage student account previews." },
    { property: "og:title", content: "User Management | Campus Coin" },
    { property: "og:description", content: "Review and manage student account previews." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell admin><AdminUsersPage/></AppShell>,
});
