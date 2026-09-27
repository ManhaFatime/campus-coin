import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/campus/public-pages";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [
    { title: "Admin Login | Campus Coin" },
    { name: "description", content: "Sign in to the Campus Coin admin workspace." },
    { property: "og:title", content: "Admin Login | Campus Coin" },
    { property: "og:description", content: "Sign in to the Campus Coin admin workspace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AuthPage mode="admin"/>,
});
