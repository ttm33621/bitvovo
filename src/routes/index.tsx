import { createFileRoute } from "@tanstack/react-router";
import { VerificationPage } from "@/components/verification-page";

export const Route = createFileRoute("/")({ component: VerificationPage });
