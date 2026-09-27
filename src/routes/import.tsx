import { createFileRoute } from "@tanstack/react-router";
import { ImportPage } from "@/components/campus/student-pages";
import { AppShell } from "@/components/campus/shared";

export const Route = createFileRoute("/import")({
  head: () => ({ meta: [
    { title: "Import Transactions | Campus Coin" },
    { name: "description", content: "Preview and map CSV transactions for import." },
    { property: "og:title", content: "Import Transactions | Campus Coin" },
    { property: "og:description", content: "Preview and map CSV transactions for import." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AppShell><ImportPage/></AppShell>,
});
