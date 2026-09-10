import type { Metadata } from "next";
import { RegisterForm } from "@/components/AuthForms";
import { AuthCard } from "@/components/ui";
import { safeInternalPath } from "@/lib/market/site";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <AuthCard
      title="Create a seller account"
      description="Use Gmail for a one-tap account, or register with email and password. Confirm email accounts before posting."
    >
      <RegisterForm next={safeInternalPath(next, "/my-ads")} />
    </AuthCard>
  );
}
