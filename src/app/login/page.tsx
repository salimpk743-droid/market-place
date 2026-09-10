import type { Metadata } from "next";
import { LoginForm } from "@/components/AuthForms";
import { AuthCard } from "@/components/ui";
import { safeInternalPath } from "@/lib/market/site";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <AuthCard
      title="Sign in"
      description="New here? Continue with Gmail or create an email account. Buyers can browse and contact without signing in."
    >
      <LoginForm next={safeInternalPath(next, "/my-ads")} />
    </AuthCard>
  );
}
