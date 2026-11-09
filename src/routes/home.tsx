import { createFileRoute } from "@tanstack/react-router";
import { ExchangeHome } from "@/components/exchange-home";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [{ title: "Keel — spot markets" }],
  }),
  component: ExchangeHome,
});
