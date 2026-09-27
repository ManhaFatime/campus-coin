import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/campus/public-pages";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [
    { title: "Create Your Account | Campus Coin" },
    { name: "description", content: "Join Campus Coin and start your student money journey." },
    { property: "og:title", content: "Create Your Account | Campus Coin" },
    { property: "og:description", content: "Join Campus Coin and start your student money journey." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AuthPage mode="register"/>,
});
