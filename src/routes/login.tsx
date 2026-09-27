import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/campus/public-pages";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Login | Campus Coin" },
    { name: "description", content: "Sign in to your Campus Coin student account." },
    { property: "og:title", content: "Login | Campus Coin" },
    { property: "og:description", content: "Sign in to your Campus Coin student account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AuthPage mode="login"/>,
});
