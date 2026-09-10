import type { Metadata } from "next";
import { ForgotForm } from "@/components/AuthForms";
import { AuthCard } from "@/components/ui";

export const metadata: Metadata = { title: "Reset password", robots: { index: false } };

export default function ForgotPage() {
  return (
    <AuthCard title="Reset password" description="We will email a reset link if that address has an account.">
      <ForgotForm />
    </AuthCard>
  );
}
