import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/campus/public-pages";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [
    { title: "Reset Password | Campus Coin" },
    { name: "description", content: "Request a password reset link for your Campus Coin account." },
    { property: "og:title", content: "Reset Password | Campus Coin" },
    { property: "og:description", content: "Request a password reset link for your Campus Coin account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AuthPage mode="forgot"/>,
});
